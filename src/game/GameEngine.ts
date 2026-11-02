/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as THREE from 'three';
import {
  VoxelExplorerCharacter,
  VoxelQuestionBlock,
  VoxelCoin,
  createVoxelCastle,
  createVoxelPipe,
  createVoxelCloud,
  createVoxelTree,
  MATERIALS
} from './voxelModels';
import { CharacterAction, Question } from '../types/game';
import { LEVEL_CONFIGS } from '../data/curriculumData';
import { soundManager } from '../audio/soundManager';

export interface PlatformBox {
  min: THREE.Vector3;
  max: THREE.Vector3;
  mesh?: THREE.Mesh | THREE.Group;
  type: 'ground' | 'brick' | 'wood' | 'pipe';
}

export class GameEngine {
  public scene: THREE.Scene;
  public camera: THREE.PerspectiveCamera;
  public renderer: THREE.WebGLRenderer;
  private container: HTMLElement;

  // Player actor
  public player: VoxelExplorerCharacter;
  public playerPos: THREE.Vector3 = new THREE.Vector3(2, 2, 0);
  public playerVel: THREE.Vector3 = new THREE.Vector3(0, 0, 0);
  public isGrounded: boolean = false;
  public currentAction: CharacterAction = 'IDLE';
  public facingDirection: number = 1; // 1 = right, -1 = left

  // Input state
  public input = {
    left: false,
    right: false,
    up: false,
    down: false,
    jump: false
  };

  // World entities
  public platforms: PlatformBox[] = [];
  public coins: VoxelCoin[] = [];
  public questionBlocks: VoxelQuestionBlock[] = [];
  public clouds: THREE.Group[] = [];
  public castleGroup: THREE.Group | null = null;
  public currentLevel: number = 1;

  // Game flow control
  public isQuizPaused: boolean = false;
  public isLevelComplete: boolean = false;
  private animationFrameId: number | null = null;
  private clock: THREE.Clock;
  private totalTime: number = 0;

  // Callbacks to React
  public onTriggerQuestion: (questionId: string) => void;
  public onCollectCoin: (isEdu: boolean) => void;
  public onLevelComplete: (level: number) => void;

  constructor(
    container: HTMLElement,
    callbacks: {
      onTriggerQuestion: (questionId: string) => void;
      onCollectCoin: (isEdu: boolean) => void;
      onLevelComplete: (level: number) => void;
    }
  ) {
    this.container = container;
    this.onTriggerQuestion = callbacks.onTriggerQuestion;
    this.onCollectCoin = callbacks.onCollectCoin;
    this.onLevelComplete = callbacks.onLevelComplete;

    // 1. Scene
    this.scene = new THREE.Scene();
    this.clock = new THREE.Clock();

    // 2. Camera: 16:9 landscape side-scrolling perspective
    const width = container.clientWidth || 800;
    const height = container.clientHeight || 450;
    this.camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 200);
    this.camera.position.set(0, 6, 15);
    this.camera.lookAt(0, 3, 0);

    // 3. Renderer
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'high-performance',
      alpha: false
    });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.15;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    this.container.innerHTML = '';
    this.container.appendChild(this.renderer.domElement);

    // 4. Lights
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444455, 0.7);
    hemiLight.position.set(0, 50, 0);
    this.scene.add(hemiLight);

    const dirLight = new THREE.DirectionalLight(0xfff5e6, 1.4);
    dirLight.position.set(20, 35, 20);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 1024;
    dirLight.shadow.mapSize.height = 1024;
    dirLight.shadow.camera.near = 0.5;
    dirLight.shadow.camera.far = 100;
    dirLight.shadow.camera.left = -25;
    dirLight.shadow.camera.right = 25;
    dirLight.shadow.camera.top = 25;
    dirLight.shadow.camera.bottom = -25;
    dirLight.shadow.bias = -0.0005;
    this.scene.add(dirLight);

    // 5. Explorer Player
    this.player = new VoxelExplorerCharacter();
    this.scene.add(this.player.group);

    // Resize handling
    window.addEventListener('resize', this.handleResize);

    // Start render loop
    this.tick();
  }

  public handleResize = () => {
    if (!this.container || !this.renderer) return;
    const w = this.container.clientWidth;
    const h = this.container.clientHeight;
    if (w === 0 || h === 0) return;
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h);
  };

  public loadLevel(levelNum: number, questions: Question[]) {
    this.currentLevel = levelNum;
    this.isLevelComplete = false;
    this.isQuizPaused = false;
    this.playerVel.set(0, 0, 0);
    this.playerPos.set(2, 2.5, 0);
    this.facingDirection = 1;
    this.currentAction = 'IDLE';

    // Clear previous world elements
    this.platforms.forEach(p => {
      if (p.mesh) this.scene.remove(p.mesh);
    });
    this.platforms = [];

    this.coins.forEach(c => this.scene.remove(c.group));
    this.coins = [];

    this.questionBlocks.forEach(b => this.scene.remove(b.mesh));
    this.questionBlocks = [];

    this.clouds.forEach(cl => this.scene.remove(cl));
    this.clouds = [];

    if (this.castleGroup) {
      this.scene.remove(this.castleGroup);
      this.castleGroup = null;
    }

    const cfg = LEVEL_CONFIGS.find(l => l.id === levelNum) || LEVEL_CONFIGS[0];

    // Sky & Fog
    this.scene.background = new THREE.Color(cfg.bgColor);
    this.scene.fog = new THREE.Fog(cfg.fogColor, 25, 75);

    // Build world for this level
    this.buildWorld(levelNum, cfg.worldLength, questions);
  }

  private addPlatform(x: number, y: number, z: number, width: number, height: number, depth: number, mat: THREE.Material, type: PlatformBox['type']) {
    const geo = new THREE.BoxGeometry(width, height, depth);
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(x + width / 2, y + height / 2, z);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    this.scene.add(mesh);

    this.platforms.push({
      min: new THREE.Vector3(x, y, z - depth / 2),
      max: new THREE.Vector3(x + width, y + height, z + depth / 2),
      mesh,
      type
    });
  }

  private buildWorld(level: number, length: number, questions: Question[]) {
    // 1. Continuous Ground with strategic gaps/pits
    const groundSegments = level === 1
      ? [{ x: -5, w: 32 }, { x: 30, w: 28 }, { x: 61, w: 35 }]
      : level === 2
      ? [{ x: -5, w: 22 }, { x: 20, w: 18 }, { x: 42, w: 20 }, { x: 66, w: 35 }]
      : [{ x: -5, w: 25 }, { x: 24, w: 20 }, { x: 48, w: 22 }, { x: 74, w: 35 }];

    groundSegments.forEach(seg => {
      // Grass top layer
      this.addPlatform(seg.x, 0, 0, seg.w, 1.2, 5, level === 2 ? MATERIALS.wood : level === 3 ? MATERIALS.castle : MATERIALS.grass, 'ground');
      // Dirt underlayer
      const dirtMesh = new THREE.Mesh(new THREE.BoxGeometry(seg.w, 8, 5), MATERIALS.dirt);
      dirtMesh.position.set(seg.x + seg.w / 2, -4, 0);
      dirtMesh.receiveShadow = true;
      this.scene.add(dirtMesh);
    });

    // 2. Suspended Platforms & Bridges
    if (level === 1) {
      // Gentle stepping stones and brick shelves
      this.addPlatform(8, 3.2, 0, 4, 0.8, 2.5, MATERIALS.brick, 'brick');
      this.addPlatform(15, 4.5, 0, 5, 0.8, 2.5, MATERIALS.brick, 'brick');
      this.addPlatform(33, 3.5, 0, 4, 0.8, 2.5, MATERIALS.brick, 'brick');
      this.addPlatform(40, 5.0, 0, 6, 0.8, 2.5, MATERIALS.brick, 'brick');
      this.addPlatform(49, 3.5, 0, 4, 0.8, 2.5, MATERIALS.brick, 'brick');
      this.addPlatform(64, 4.0, 0, 5, 0.8, 2.5, MATERIALS.brick, 'brick');

      // Pipes
      const p1 = createVoxelPipe(26, 1.2, 0, 2.2);
      this.scene.add(p1);
      this.platforms.push({
        min: new THREE.Vector3(25.2, 1.2, -1),
        max: new THREE.Vector3(26.8, 3.4, 1),
        mesh: p1,
        type: 'pipe'
      });

      const p2 = createVoxelPipe(58, 1.2, 0, 2.8);
      this.scene.add(p2);
      this.platforms.push({
        min: new THREE.Vector3(57.2, 1.2, -1),
        max: new THREE.Vector3(58.8, 4.0, 1),
        mesh: p2,
        type: 'pipe'
      });

      // Trees along path
      [-2, 6, 22, 38, 54, 70].forEach(tx => {
        const tree = createVoxelTree(tx, 1.2, -2.5);
        this.scene.add(tree);
      });
    } else if (level === 2) {
      // Wood Bridge theme
      this.addPlatform(18, 3.0, 0, 6, 0.6, 2.5, MATERIALS.wood, 'wood');
      this.addPlatform(27, 4.8, 0, 5, 0.6, 2.5, MATERIALS.wood, 'wood');
      this.addPlatform(39, 3.2, 0, 7, 0.6, 2.5, MATERIALS.wood, 'wood');
      this.addPlatform(49, 5.0, 0, 6, 0.6, 2.5, MATERIALS.wood, 'wood');
      this.addPlatform(62, 3.6, 0, 5, 0.6, 2.5, MATERIALS.wood, 'wood');

      // Ropes and posts for bridge vibe
      [18, 24, 27, 32, 39, 46, 49, 55].forEach(rx => {
        const post = new THREE.Mesh(new THREE.BoxGeometry(0.3, 1.5, 2.6), MATERIALS.wood);
        post.position.set(rx, 4.0, 0);
        this.scene.add(post);
      });

      [-1, 15, 36, 68].forEach(tx => {
        const tree = createVoxelTree(tx, 1.2, -2.5);
        this.scene.add(tree);
      });
    } else {
      // Castle Ramparts theme
      this.addPlatform(10, 3.5, 0, 5, 0.9, 2.5, MATERIALS.castle, 'brick');
      this.addPlatform(18, 5.2, 0, 6, 0.9, 2.5, MATERIALS.castle, 'brick');
      this.addPlatform(32, 3.8, 0, 5, 0.9, 2.5, MATERIALS.castle, 'brick');
      this.addPlatform(40, 5.8, 0, 6, 0.9, 2.5, MATERIALS.castle, 'brick');
      this.addPlatform(52, 4.0, 0, 5, 0.9, 2.5, MATERIALS.castle, 'brick');
      this.addPlatform(63, 5.5, 0, 7, 0.9, 2.5, MATERIALS.castle, 'brick');

      // Castle pillars
      [10, 15, 32, 37, 52, 57].forEach(px => {
        const col = new THREE.Mesh(new THREE.BoxGeometry(0.8, 5, 0.8), MATERIALS.castle);
        col.position.set(px, 2.5, -1.8);
        this.scene.add(col);
      });
    }

    // 3. Clouds in background sky
    for (let cx = 0; cx < length; cx += 16) {
      const cy = 8 + Math.sin(cx) * 3;
      const cz = -10 - Math.random() * 5;
      const cloud = createVoxelCloud(cx, cy, cz, 1.0 + Math.random() * 0.5);
      this.scene.add(cloud);
      this.clouds.push(cloud);
    }

    // 4. Place 5 Education Coins per level corresponding to the 5 level questions!
    const levelQuestions = questions.filter(q => q.level === level);
    // Well-spaced coordinates along the level
    const eduCoinPositions = level === 1
      ? [{ x: 10, y: 5.0 }, { x: 26, y: 5.0 }, { x: 42, y: 6.8 }, { x: 50, y: 5.2 }, { x: 66, y: 5.8 }]
      : level === 2
      ? [{ x: 12, y: 2.8 }, { x: 29, y: 6.5 }, { x: 42, y: 5.0 }, { x: 52, y: 6.8 }, { x: 64, y: 5.5 }]
      : [{ x: 12, y: 5.2 }, { x: 21, y: 7.0 }, { x: 35, y: 5.5 }, { x: 43, y: 7.5 }, { x: 66, y: 7.2 }];

    eduCoinPositions.forEach((pos, idx) => {
      const q = levelQuestions[idx];
      const qId = q ? q.id : `Q${(level - 1) * 5 + idx + 1}`;
      const isAlreadySolved = q?.solved;
      const coin = new VoxelCoin(pos.x, pos.y, 0, true, qId);
      if (isAlreadySolved) {
        coin.collected = true;
        coin.group.visible = false;
      }
      this.scene.add(coin.group);
      this.coins.push(coin);
    });

    // 5. Mystery Question Blocks (hitting from beneath triggers question block!)
    const blockPositions = level === 1
      ? [{ x: 17, y: 4.8, qId: 'Q2' }, { x: 44, y: 5.2, qId: 'Q4' }]
      : level === 2
      ? [{ x: 31, y: 5.0, qId: 'Q7' }, { x: 54, y: 5.4, qId: 'Q9' }]
      : [{ x: 23, y: 5.4, qId: 'Q12' }, { x: 45, y: 5.6, qId: 'Q14' }];

    blockPositions.forEach(b => {
      const q = questions.find(item => item.id === b.qId);
      const qBlock = new VoxelQuestionBlock(b.x, b.y, 0, b.qId);
      if (q?.solved) {
        qBlock.triggerBump();
      }
      this.scene.add(qBlock.mesh);
      this.questionBlocks.push(qBlock);
      // Also register as a solid platform from top
      this.platforms.push({
        min: new THREE.Vector3(b.x - 0.6, b.y - 0.6, -0.6),
        max: new THREE.Vector3(b.x + 0.6, b.y + 0.6, 0.6),
        mesh: qBlock.mesh,
        type: 'brick'
      });
    });

    // 6. Regular Gold Coins (adds 10 points + 1 coin)
    const goldCoinPositions = [
      { x: 4, y: 2.5 }, { x: 5.5, y: 2.5 }, { x: 7, y: 2.5 },
      { x: 15, y: 2.5 }, { x: 16.5, y: 2.5 },
      { x: 21, y: 2.5 }, { x: 22.5, y: 2.5 },
      { x: 34, y: 4.8 }, { x: 35.5, y: 4.8 },
      { x: 48, y: 2.5 }, { x: 49.5, y: 2.5 },
      { x: 56, y: 2.5 }, { x: 57.5, y: 2.5 },
      { x: 62, y: 5.2 }, { x: 63.5, y: 5.2 },
      { x: 72, y: 2.5 }, { x: 73.5, y: 2.5 }
    ];

    goldCoinPositions.forEach(pos => {
      const coin = new VoxelCoin(pos.x, pos.y, 0, false);
      this.scene.add(coin.group);
      this.coins.push(coin);
    });

    // 7. Goal Castle at end of level
    const castleX = length - 8;
    this.castleGroup = createVoxelCastle(castleX, 1.2, 0);
    this.scene.add(this.castleGroup);
  }

  // Update Game Loop
  private tick = () => {
    this.animationFrameId = requestAnimationFrame(this.tick);
    const delta = Math.min(this.clock.getDelta(), 0.05); // Cap delta to avoid teleporting
    this.totalTime += delta;

    // Render clouds slow drift
    this.clouds.forEach(cl => {
      cl.position.x -= delta * 0.3;
      if (cl.position.x < -15) cl.position.x = 100;
    });

    // Update coins & question blocks
    this.coins.forEach(c => c.update(this.totalTime));
    this.questionBlocks.forEach(b => b.update(delta));

    // If quiz modal is currently open, character physics & movement are paused!
    if (!this.isQuizPaused && !this.isLevelComplete) {
      this.updatePlayerPhysics(delta);
      this.checkCoinCollisions();
      this.checkQuestionBlockBumps();
      this.checkGoalCastle();
    } else if (this.isQuizPaused) {
      // Idle animation during quiz pause, camera stays locked on character
      this.player.updateAnimation('IDLE', this.totalTime, this.facingDirection);
    } else if (this.isLevelComplete) {
      this.player.updateAnimation('CELEBRATE_WIN', this.totalTime, this.facingDirection);
    }

    // Camera follow player smoothly
    const targetCamX = this.playerPos.x + 3.0;
    const targetCamY = THREE.MathUtils.clamp(this.playerPos.y + 3.5, 4.5, 9.5);
    this.camera.position.x = THREE.MathUtils.damp(this.camera.position.x, targetCamX, 6, delta);
    this.camera.position.y = THREE.MathUtils.damp(this.camera.position.y, targetCamY, 4, delta);
    this.camera.lookAt(this.playerPos.x + 1.5, targetCamY - 1.2, 0);

    this.renderer.render(this.scene, this.camera);
  };

  private updatePlayerPhysics(delta: number) {
    const SPEED = 7.5;
    const GRAVITY = -28;
    const JUMP_FORCE = 13.8;

    // Horizontal Movement
    if (this.input.left) {
      this.playerVel.x = -SPEED;
      this.facingDirection = -1;
    } else if (this.input.right) {
      this.playerVel.x = SPEED;
      this.facingDirection = 1;
    } else {
      this.playerVel.x = 0;
    }

    // Jump Input
    if ((this.input.jump || this.input.up) && this.isGrounded) {
      this.playerVel.y = JUMP_FORCE;
      this.isGrounded = false;
      soundManager.playJump();
    }

    // Apply gravity
    this.playerVel.y += GRAVITY * delta;
    if (this.playerVel.y < -30) this.playerVel.y = -30;

    // Intended next position
    const nextX = this.playerPos.x + this.playerVel.x * delta;
    const nextY = this.playerPos.y + this.playerVel.y * delta;

    // Character Bounding Box [x ± 0.35, y from 0 to 1.9, z ± 0.3]
    const pWidth = 0.35;
    const pHeight = 1.9;

    // 1. Resolve X collision with platforms
    let resolvedX = nextX;
    for (const p of this.platforms) {
      const willCollideX =
        nextX + pWidth > p.min.x &&
        nextX - pWidth < p.max.x &&
        this.playerPos.y + 0.1 < p.max.y &&
        this.playerPos.y + pHeight - 0.2 > p.min.y;

      if (willCollideX) {
        if (this.playerVel.x > 0) {
          resolvedX = p.min.x - pWidth;
        } else if (this.playerVel.x < 0) {
          resolvedX = p.max.x + pWidth;
        }
        this.playerVel.x = 0;
      }
    }
    this.playerPos.x = resolvedX;

    // 2. Resolve Y collision with platforms
    let resolvedY = nextY;
    let groundedThisFrame = false;

    for (const p of this.platforms) {
      const insideX = this.playerPos.x + pWidth > p.min.x && this.playerPos.x - pWidth < p.max.x;
      if (!insideX) continue;

      // Landing from above
      if (this.playerVel.y <= 0 && this.playerPos.y >= p.max.y - 0.3 && nextY <= p.max.y) {
        resolvedY = p.max.y;
        this.playerVel.y = 0;
        groundedThisFrame = true;
      }
      // Hitting head from below
      else if (this.playerVel.y > 0 && this.playerPos.y + pHeight <= p.min.y + 0.4 && nextY + pHeight >= p.min.y) {
        resolvedY = p.min.y - pHeight;
        this.playerVel.y = 0;
      }
    }

    this.playerPos.y = resolvedY;
    this.isGrounded = groundedThisFrame;

    // Fall out of bounds safeguard: respawn back on platform
    if (this.playerPos.y < -4) {
      this.playerPos.set(Math.max(2, this.playerPos.x - 8), 3.5, 0);
      this.playerVel.set(0, 0, 0);
      this.isGrounded = false;
    }

    // Set animation action
    if (!this.isGrounded) {
      this.currentAction = 'JUMP';
    } else if (Math.abs(this.playerVel.x) > 0.1) {
      this.currentAction = 'RUN';
    } else {
      this.currentAction = 'IDLE';
    }

    // Sync 3D mesh
    this.player.group.position.copy(this.playerPos);
    this.player.updateAnimation(this.currentAction, this.totalTime, this.facingDirection);
  }

  private checkCoinCollisions() {
    const pBox = new THREE.Box3(
      new THREE.Vector3(this.playerPos.x - 0.4, this.playerPos.y, -0.5),
      new THREE.Vector3(this.playerPos.x + 0.4, this.playerPos.y + 1.9, 0.5)
    );

    for (const coin of this.coins) {
      if (coin.collected) continue;

      const cBox = new THREE.Box3(
        new THREE.Vector3(coin.group.position.x - 0.45, coin.group.position.y - 0.45, -0.5),
        new THREE.Vector3(coin.group.position.x + 0.45, coin.group.position.y + 0.45, 0.5)
      );

      if (pBox.intersectsBox(cBox)) {
        coin.collected = true;
        coin.group.visible = false;

        if (coin.isEduCoin && coin.questionId) {
          soundManager.playEduCoin();
          this.onCollectCoin(true);
          // Pause and trigger question
          this.pauseForQuiz();
          this.onTriggerQuestion(coin.questionId);
        } else {
          soundManager.playCoin();
          this.onCollectCoin(false);
        }
      }
    }
  }

  private checkQuestionBlockBumps() {
    // If player hits question block from beneath
    const headY = this.playerPos.y + 1.9;
    for (const block of this.questionBlocks) {
      if (block.isHit) continue;
      const bMin = block.mesh.position.x - 0.7;
      const bMax = block.mesh.position.x + 0.7;
      const bBottom = block.mesh.position.y - 0.6;

      if (
        this.playerPos.x > bMin &&
        this.playerPos.x < bMax &&
        headY >= bBottom - 0.2 &&
        headY <= bBottom + 0.4
      ) {
        block.triggerBump();
        soundManager.playBump();
        this.pauseForQuiz();
        this.onTriggerQuestion(block.questionId);
      }
    }
  }

  private checkGoalCastle() {
    if (!this.castleGroup || this.isLevelComplete) return;
    const castleX = this.castleGroup.position.x;
    if (this.playerPos.x >= castleX - 1.5) {
      this.isLevelComplete = true;
      soundManager.playVictory();
      this.onLevelComplete(this.currentLevel);
    }
  }

  public pauseForQuiz() {
    this.isQuizPaused = true;
    this.playerVel.set(0, 0, 0);
  }

  public resumeFromQuiz(isCorrect: boolean) {
    if (isCorrect) {
      // Trigger celebrate animation briefly
      this.currentAction = 'CELEBRATE_CORRECT';
      this.player.updateAnimation('CELEBRATE_CORRECT', this.totalTime, this.facingDirection);
      setTimeout(() => {
        this.isQuizPaused = false;
        this.currentAction = 'IDLE';
      }, 700);
    } else {
      this.isQuizPaused = false;
      this.currentAction = 'IDLE';
    }
  }

  public cleanup() {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
    }
    window.removeEventListener('resize', this.handleResize);
    this.renderer.dispose();
  }
}
