/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as THREE from 'three';
import { CharacterAction } from '../types/game';

// Procedural textures for retro pixel art voxel feel
function createVoxelTexture(type: 'grass' | 'dirt' | 'brick' | 'question' | 'wood' | 'castle' | 'gold_coin'): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d')!;

  if (type === 'grass') {
    ctx.fillStyle = '#48bb78';
    ctx.fillRect(0, 0, 64, 64);
    // pixel variations
    for (let x = 0; x < 64; x += 8) {
      for (let y = 0; y < 64; y += 8) {
        if (Math.random() > 0.5) {
          ctx.fillStyle = Math.random() > 0.5 ? '#38a169' : '#68d391';
          ctx.fillRect(x, y, 8, 8);
        }
      }
    }
  } else if (type === 'dirt') {
    ctx.fillStyle = '#8b5a2b';
    ctx.fillRect(0, 0, 64, 64);
    for (let x = 0; x < 64; x += 8) {
      for (let y = 0; y < 64; y += 8) {
        if (Math.random() > 0.5) {
          ctx.fillStyle = Math.random() > 0.5 ? '#73461c' : '#a06834';
          ctx.fillRect(x, y, 8, 8);
        }
      }
    }
  } else if (type === 'brick') {
    ctx.fillStyle = '#c53030';
    ctx.fillRect(0, 0, 64, 64);
    // Mortar grid lines
    ctx.fillStyle = '#4a1515';
    ctx.fillRect(0, 30, 64, 4);
    ctx.fillRect(0, 60, 64, 4);
    ctx.fillRect(30, 0, 4, 30);
    ctx.fillRect(0, 34, 4, 30);
    ctx.fillRect(60, 34, 4, 30);
  } else if (type === 'question') {
    ctx.fillStyle = '#f6ad55';
    ctx.fillRect(0, 0, 64, 64);
    // Bevel edges
    ctx.fillStyle = '#dd6b20';
    ctx.fillRect(0, 0, 64, 6);
    ctx.fillRect(0, 0, 6, 64);
    ctx.fillStyle = '#c05621';
    ctx.fillRect(0, 58, 64, 6);
    ctx.fillRect(58, 0, 6, 64);

    // Question mark pixel style
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(24, 14, 16, 6);
    ctx.fillRect(40, 20, 6, 12);
    ctx.fillRect(28, 28, 12, 6);
    ctx.fillRect(28, 34, 6, 8);
    ctx.fillRect(28, 46, 6, 6); // dot
  } else if (type === 'wood') {
    ctx.fillStyle = '#975a16';
    ctx.fillRect(0, 0, 64, 64);
    ctx.fillStyle = '#744210';
    ctx.fillRect(0, 8, 64, 3);
    ctx.fillRect(0, 24, 64, 3);
    ctx.fillRect(0, 40, 64, 3);
    ctx.fillRect(0, 56, 64, 3);
  } else if (type === 'castle') {
    ctx.fillStyle = '#718096';
    ctx.fillRect(0, 0, 64, 64);
    ctx.fillStyle = '#4a5568';
    ctx.fillRect(0, 30, 64, 4);
    ctx.fillRect(30, 0, 4, 30);
    ctx.fillRect(0, 34, 4, 30);
    ctx.fillRect(60, 34, 4, 30);
  } else if (type === 'gold_coin') {
    ctx.fillStyle = '#ecc94b';
    ctx.fillRect(0, 0, 64, 64);
    ctx.fillStyle = '#d69e2e';
    ctx.fillRect(8, 8, 48, 48);
    ctx.fillStyle = '#fefcbf';
    ctx.fillRect(16, 16, 32, 32);
    // Star center
    ctx.fillStyle = '#b7791f';
    ctx.fillRect(28, 20, 8, 24);
    ctx.fillRect(20, 28, 24, 8);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.magFilter = THREE.NearestFilter;
  texture.minFilter = THREE.NearestFilter;
  return texture;
}

// Material cache
export const MATERIALS = {
  grass: new THREE.MeshStandardMaterial({
    map: createVoxelTexture('grass'),
    roughness: 0.8,
    metalness: 0.1
  }),
  dirt: new THREE.MeshStandardMaterial({
    map: createVoxelTexture('dirt'),
    roughness: 0.9,
    metalness: 0.05
  }),
  brick: new THREE.MeshStandardMaterial({
    map: createVoxelTexture('brick'),
    roughness: 0.7,
    metalness: 0.1
  }),
  questionBlock: new THREE.MeshStandardMaterial({
    map: createVoxelTexture('question'),
    roughness: 0.4,
    metalness: 0.2
  }),
  questionBlockInactive: new THREE.MeshStandardMaterial({
    color: '#a0aec0',
    roughness: 0.7,
    metalness: 0.1
  }),
  wood: new THREE.MeshStandardMaterial({
    map: createVoxelTexture('wood'),
    roughness: 0.8,
    metalness: 0.1
  }),
  castle: new THREE.MeshStandardMaterial({
    map: createVoxelTexture('castle'),
    roughness: 0.75,
    metalness: 0.15
  }),
  gold: new THREE.MeshStandardMaterial({
    color: '#ffd700',
    metalness: 0.85,
    roughness: 0.2,
    emissive: '#775200',
    emissiveIntensity: 0.2
  }),
  eduGold: new THREE.MeshStandardMaterial({
    color: '#00e5ff',
    metalness: 0.9,
    roughness: 0.15,
    emissive: '#0088cc',
    emissiveIntensity: 0.5
  }),
  pipeGreen: new THREE.MeshStandardMaterial({
    color: '#38a169',
    roughness: 0.4,
    metalness: 0.2
  }),
  pipeRim: new THREE.MeshStandardMaterial({
    color: '#2f855a',
    roughness: 0.3,
    metalness: 0.25
  }),
  cloud: new THREE.MeshStandardMaterial({
    color: '#ffffff',
    roughness: 0.9,
    metalness: 0.0,
    transparent: true,
    opacity: 0.92
  }),
  treeTrunk: new THREE.MeshStandardMaterial({
    color: '#5c3818',
    roughness: 0.9
  }),
  treeLeaves: new THREE.MeshStandardMaterial({
    color: '#2f855a',
    roughness: 0.8
  }),
  bridgeRope: new THREE.MeshStandardMaterial({
    color: '#d69e2e',
    roughness: 0.9
  }),
  flagPole: new THREE.MeshStandardMaterial({
    color: '#cbd5e0',
    metalness: 0.6,
    roughness: 0.3
  }),
  flagBanner: new THREE.MeshStandardMaterial({
    color: '#e53e3e',
    roughness: 0.5
  })
};

// 3D Voxel Explorer Character
export class VoxelExplorerCharacter {
  public group: THREE.Group;
  public body: THREE.Group;
  public head: THREE.Group;
  public leftArm: THREE.Group;
  public rightArm: THREE.Group;
  public leftLeg: THREE.Group;
  public rightLeg: THREE.Group;
  public hat: THREE.Group;
  public backpack: THREE.Mesh;
  public celebrateEffect: THREE.Group;

  constructor() {
    this.group = new THREE.Group();

    // Body container for squash & stretch and bobbing
    this.body = new THREE.Group();
    this.group.add(this.body);

    // Torso (Explorer vest & shirt)
    const torsoMat = new THREE.MeshStandardMaterial({ color: '#2b6cb0', roughness: 0.7 });
    const torsoGeom = new THREE.BoxGeometry(0.7, 0.8, 0.45);
    const torso = new THREE.Mesh(torsoGeom, torsoMat);
    torso.position.y = 1.0;
    torso.castShadow = true;
    this.body.add(torso);

    // Scarf / Bandana (Orange explorer scarf)
    const scarfMat = new THREE.MeshStandardMaterial({ color: '#ed8936', roughness: 0.6 });
    const scarf = new THREE.Mesh(new THREE.BoxGeometry(0.74, 0.16, 0.48), scarfMat);
    scarf.position.y = 1.35;
    scarf.castShadow = true;
    this.body.add(scarf);

    // Explorer Belt & Gold buckle
    const beltMat = new THREE.MeshStandardMaterial({ color: '#4a2810', roughness: 0.8 });
    const belt = new THREE.Mesh(new THREE.BoxGeometry(0.72, 0.12, 0.47), beltMat);
    belt.position.y = 0.68;
    this.body.add(belt);

    const buckleMat = new THREE.MeshStandardMaterial({ color: '#ecc94b', metalness: 0.8, roughness: 0.3 });
    const buckle = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.14, 0.49), buckleMat);
    buckle.position.set(0, 0.68, 0.01);
    this.body.add(buckle);

    // Backpack (Green explorer pack with pocket)
    const packMat = new THREE.MeshStandardMaterial({ color: '#2f855a', roughness: 0.8 });
    this.backpack = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.6, 0.3), packMat);
    this.backpack.position.set(0, 1.0, -0.32);
    this.backpack.castShadow = true;
    this.body.add(this.backpack);

    // Bedroll / sleeping bag strapped atop backpack
    const rollMat = new THREE.MeshStandardMaterial({ color: '#dd6b20', roughness: 0.8 });
    const bedroll = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.18, 0.22), rollMat);
    bedroll.position.set(0, 1.38, -0.3);
    this.body.add(bedroll);

    // Head Group
    this.head = new THREE.Group();
    this.head.position.y = 1.65;
    this.body.add(this.head);

    // Face / Head block
    const skinMat = new THREE.MeshStandardMaterial({ color: '#fbd38d', roughness: 0.7 });
    const headMesh = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.6, 0.55), skinMat);
    headMesh.castShadow = true;
    this.head.add(headMesh);

    // Eyes (Friendly pixel eyes)
    const eyeMat = new THREE.MeshStandardMaterial({ color: '#1a202c', roughness: 0.5 });
    const leftEye = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.12, 0.05), eyeMat);
    leftEye.position.set(-0.16, 0.02, 0.28);
    this.head.add(leftEye);

    const rightEye = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.12, 0.05), eyeMat);
    rightEye.position.set(0.16, 0.02, 0.28);
    this.head.add(rightEye);

    // Friendly smile
    const mouthMat = new THREE.MeshStandardMaterial({ color: '#c53030' });
    const mouth = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.05, 0.04), mouthMat);
    mouth.position.set(0, -0.15, 0.28);
    this.head.add(mouth);

    // Explorer Safari / Fedora Hat
    this.hat = new THREE.Group();
    const hatMat = new THREE.MeshStandardMaterial({ color: '#d69e2e', roughness: 0.7 });
    // Hat brim
    const brim = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.08, 0.9), hatMat);
    brim.position.y = 0.32;
    brim.castShadow = true;
    this.hat.add(brim);

    // Hat crown
    const crown = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.3, 0.55), hatMat);
    crown.position.y = 0.48;
    crown.castShadow = true;
    this.hat.add(crown);

    // Hat band
    const bandMat = new THREE.MeshStandardMaterial({ color: '#744210' });
    const band = new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.08, 0.57), bandMat);
    band.position.y = 0.38;
    this.hat.add(band);

    this.head.add(this.hat);

    // Arms (pivot at shoulder)
    const armGeom = new THREE.BoxGeometry(0.24, 0.65, 0.24);
    armGeom.translate(0, -0.28, 0); // Pivot at shoulder

    const armMat = new THREE.MeshStandardMaterial({ color: '#3182ce', roughness: 0.7 });
    const handMat = new THREE.MeshStandardMaterial({ color: '#fbd38d' });

    // Left Arm
    this.leftArm = new THREE.Group();
    this.leftArm.position.set(-0.48, 1.3, 0);
    const leftArmMesh = new THREE.Mesh(armGeom, armMat);
    leftArmMesh.castShadow = true;
    this.leftArm.add(leftArmMesh);
    const leftHand = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.18, 0.2), handMat);
    leftHand.position.y = -0.62;
    this.leftArm.add(leftHand);
    this.body.add(this.leftArm);

    // Right Arm
    this.rightArm = new THREE.Group();
    this.rightArm.position.set(0.48, 1.3, 0);
    const rightArmMesh = new THREE.Mesh(armGeom, armMat);
    rightArmMesh.castShadow = true;
    this.rightArm.add(rightArmMesh);
    const rightHand = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.18, 0.2), handMat);
    rightHand.position.y = -0.62;
    this.rightArm.add(rightHand);
    this.body.add(this.rightArm);

    // Legs (pivot at hips)
    const legGeom = new THREE.BoxGeometry(0.28, 0.65, 0.28);
    legGeom.translate(0, -0.3, 0); // Pivot at hip

    const pantsMat = new THREE.MeshStandardMaterial({ color: '#4a5568', roughness: 0.8 });
    const bootMat = new THREE.MeshStandardMaterial({ color: '#744210', roughness: 0.7 });

    // Left Leg
    this.leftLeg = new THREE.Group();
    this.leftLeg.position.set(-0.2, 0.65, 0);
    const leftLegMesh = new THREE.Mesh(legGeom, pantsMat);
    leftLegMesh.castShadow = true;
    this.leftLeg.add(leftLegMesh);
    const leftBoot = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.2, 0.38), bootMat);
    leftBoot.position.set(0, -0.55, 0.05);
    leftBoot.castShadow = true;
    this.leftLeg.add(leftBoot);
    this.group.add(this.leftLeg);

    // Right Leg
    this.rightLeg = new THREE.Group();
    this.rightLeg.position.set(0.2, 0.65, 0);
    const rightLegMesh = new THREE.Mesh(legGeom, pantsMat);
    rightLegMesh.castShadow = true;
    this.rightLeg.add(rightLegMesh);
    const rightBoot = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.2, 0.38), bootMat);
    rightBoot.position.set(0, -0.55, 0.05);
    rightBoot.castShadow = true;
    this.rightLeg.add(rightBoot);
    this.group.add(this.rightLeg);

    // Celebration Sparkle / Star ring (hidden until triggered)
    this.celebrateEffect = new THREE.Group();
    this.celebrateEffect.visible = false;
    for (let i = 0; i < 6; i++) {
      const star = new THREE.Mesh(
        new THREE.OctahedronGeometry(0.18, 0),
        new THREE.MeshBasicMaterial({ color: '#ecc94b' })
      );
      const angle = (i / 6) * Math.PI * 2;
      star.position.set(Math.cos(angle) * 0.9, 1.8 + Math.sin(angle) * 0.4, Math.sin(angle) * 0.3);
      this.celebrateEffect.add(star);
    }
    this.group.add(this.celebrateEffect);

    // Shadow plane beneath character
    const shadowGeo = new THREE.PlaneGeometry(0.9, 0.6);
    const shadowMat = new THREE.MeshBasicMaterial({
      color: 0x000000,
      transparent: true,
      opacity: 0.3,
      depthWrite: false
    });
    const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
    shadowMesh.rotation.x = -Math.PI / 2;
    shadowMesh.position.y = 0.02;
    this.group.add(shadowMesh);
  }

  public updateAnimation(action: CharacterAction, time: number, direction: number) {
    // Face direction: 1 = right (rotation.y = 0 or Math.PI / 2), -1 = left
    if (direction > 0) {
      this.group.rotation.y = Math.PI / 2;
    } else if (direction < 0) {
      this.group.rotation.y = -Math.PI / 2;
    }

    if (action === 'WALK' || action === 'RUN') {
      const speed = action === 'RUN' ? 14 : 9;
      const legSwing = Math.sin(time * speed) * 0.8;
      const armSwing = Math.cos(time * speed) * 0.8;

      this.leftLeg.rotation.x = legSwing;
      this.rightLeg.rotation.x = -legSwing;
      this.leftArm.rotation.x = -armSwing;
      this.rightArm.rotation.x = armSwing;

      // Bobbing body
      this.body.position.y = Math.abs(Math.sin(time * speed)) * 0.08;
      this.head.rotation.z = Math.sin(time * (speed / 2)) * 0.05;
      this.celebrateEffect.visible = false;
    } else if (action === 'JUMP') {
      // Arms up in air, legs pulled back
      this.leftLeg.rotation.x = -0.4;
      this.rightLeg.rotation.x = -0.2;
      this.leftArm.rotation.x = -2.4;
      this.rightArm.rotation.x = -2.4;
      this.body.position.y = 0.1;
      this.celebrateEffect.visible = false;
    } else if (action === 'CELEBRATE_CORRECT' || action === 'CELEBRATE_WIN') {
      // Both arms raised high, jumping with joy!
      this.leftArm.rotation.x = -2.8 + Math.sin(time * 12) * 0.2;
      this.rightArm.rotation.x = -2.8 - Math.sin(time * 12) * 0.2;
      this.leftLeg.rotation.x = Math.sin(time * 10) * 0.3;
      this.rightLeg.rotation.x = -Math.sin(time * 10) * 0.3;
      this.body.position.y = Math.abs(Math.sin(time * 8)) * 0.3;

      this.celebrateEffect.visible = true;
      this.celebrateEffect.rotation.y = time * 4;
    } else {
      // IDLE
      const breath = Math.sin(time * 2.5) * 0.03;
      this.body.position.y = breath;
      this.head.position.y = 1.65 + breath * 0.5;
      this.leftLeg.rotation.x = 0;
      this.rightLeg.rotation.x = 0;
      this.leftArm.rotation.x = Math.sin(time * 2) * 0.06;
      this.rightArm.rotation.x = -Math.sin(time * 2) * 0.06;
      this.celebrateEffect.visible = false;
    }
  }
}

// 3D Voxel Mystery Question Block
export class VoxelQuestionBlock {
  public mesh: THREE.Mesh;
  public questionId: string;
  public basePosition: THREE.Vector3;
  public isHit: boolean = false;
  private bumpTime: number = 0;

  constructor(x: number, y: number, z: number, questionId: string) {
    this.questionId = questionId;
    this.basePosition = new THREE.Vector3(x, y, z);
    const geo = new THREE.BoxGeometry(1.2, 1.2, 1.2);
    this.mesh = new THREE.Mesh(geo, MATERIALS.questionBlock);
    this.mesh.position.copy(this.basePosition);
    this.mesh.castShadow = true;
    this.mesh.receiveShadow = true;
  }

  public triggerBump() {
    if (!this.isHit) {
      this.isHit = true;
      this.bumpTime = 1.0;
      this.mesh.material = MATERIALS.questionBlockInactive;
    }
  }

  public update(delta: number) {
    if (this.bumpTime > 0) {
      this.bumpTime -= delta * 4;
      if (this.bumpTime < 0) this.bumpTime = 0;
      const offset = Math.sin(this.bumpTime * Math.PI) * 0.35;
      this.mesh.position.y = this.basePosition.y + offset;
    }
  }
}

// 3D Voxel Coin (Normal or Edu Coin)
export class VoxelCoin {
  public group: THREE.Group;
  public coinMesh: THREE.Mesh;
  public isEduCoin: boolean;
  public questionId?: string;
  public collected: boolean = false;
  public basePosition: THREE.Vector3;
  private glowMesh?: THREE.Mesh;

  constructor(x: number, y: number, z: number, isEduCoin: boolean, questionId?: string) {
    this.isEduCoin = isEduCoin;
    this.questionId = questionId;
    this.basePosition = new THREE.Vector3(x, y, z);
    this.group = new THREE.Group();
    this.group.position.copy(this.basePosition);

    const radius = isEduCoin ? 0.45 : 0.35;
    const thickness = 0.12;
    // 3D Cylinder Coin
    const coinGeo = new THREE.CylinderGeometry(radius, radius, thickness, 16);
    coinGeo.rotateX(Math.PI / 2); // face front

    this.coinMesh = new THREE.Mesh(coinGeo, isEduCoin ? MATERIALS.eduGold : MATERIALS.gold);
    this.coinMesh.castShadow = true;
    this.group.add(this.coinMesh);

    // Edu coin gets a crystal glow star
    if (isEduCoin) {
      const glowGeo = new THREE.OctahedronGeometry(0.3, 0);
      const glowMat = new THREE.MeshBasicMaterial({
        color: 0x67e8f9,
        wireframe: true
      });
      this.glowMesh = new THREE.Mesh(glowGeo, glowMat);
      this.glowMesh.position.z = 0;
      this.group.add(this.glowMesh);

      // Book icon indicator in voxel
      const bookGeo = new THREE.BoxGeometry(0.3, 0.35, 0.16);
      const bookMat = new THREE.MeshStandardMaterial({ color: 0x3b82f6 });
      const bookMesh = new THREE.Mesh(bookGeo, bookMat);
      this.group.add(bookMesh);
    }
  }

  public update(time: number) {
    if (!this.collected) {
      // Rotation
      this.group.rotation.y = time * 3.5;
      // Gentle floating bob
      this.group.position.y = this.basePosition.y + Math.sin(time * 3 + this.basePosition.x) * 0.12;

      if (this.glowMesh) {
        this.glowMesh.rotation.x = time * 2;
        this.glowMesh.rotation.z = time * 2.5;
      }
    }
  }
}

// 3D Voxel Castle (Finish Goal)
export function createVoxelCastle(x: number, y: number, z: number): THREE.Group {
  const castle = new THREE.Group();
  castle.position.set(x, y, z);

  // Main Wall
  const wall = new THREE.Mesh(new THREE.BoxGeometry(7, 4.5, 3), MATERIALS.castle);
  wall.position.y = 2.25;
  wall.castShadow = true;
  wall.receiveShadow = true;
  castle.add(wall);

  // Archway door
  const door = new THREE.Mesh(
    new THREE.BoxGeometry(2.2, 3, 3.2),
    new THREE.MeshStandardMaterial({ color: '#1a202c', roughness: 0.9 })
  );
  door.position.set(0, 1.5, 0);
  castle.add(door);

  // Left Tower
  const towerGeo = new THREE.BoxGeometry(2.2, 7, 2.2);
  const leftTower = new THREE.Mesh(towerGeo, MATERIALS.castle);
  leftTower.position.set(-3.5, 3.5, 0);
  leftTower.castShadow = true;
  castle.add(leftTower);

  // Right Tower
  const rightTower = new THREE.Mesh(towerGeo, MATERIALS.castle);
  rightTower.position.set(3.5, 3.5, 0);
  rightTower.castShadow = true;
  castle.add(rightTower);

  // Battlements on towers
  for (let t = -1; t <= 1; t += 2) {
    const battlement = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.8, 2.4), MATERIALS.castle);
    battlement.position.set(t * 3.5, 7.2, 0);
    castle.add(battlement);

    // Tower Spire Roof (Voxel Pyramid / Cone)
    const roof = new THREE.Mesh(
      new THREE.ConeGeometry(1.6, 2.4, 4),
      new THREE.MeshStandardMaterial({ color: '#c53030', roughness: 0.6 })
    );
    roof.position.set(t * 3.5, 8.8, 0);
    roof.rotation.y = Math.PI / 4;
    castle.add(roof);
  }

  // Central Grand Flagpole
  const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 4), MATERIALS.flagPole);
  pole.position.set(0, 6.2, 0);
  castle.add(pole);

  // Victory Gold Crest / Flag
  const flag = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.8, 0.08), MATERIALS.flagBanner);
  flag.position.set(0.7, 7.4, 0);
  castle.add(flag);

  return castle;
}

// 3D Voxel Green Pipe
export function createVoxelPipe(x: number, y: number, z: number, height: number = 2.2): THREE.Group {
  const pipe = new THREE.Group();
  pipe.position.set(x, y, z);

  const bodyGeo = new THREE.CylinderGeometry(0.8, 0.8, height, 16);
  const body = new THREE.Mesh(bodyGeo, MATERIALS.pipeGreen);
  body.position.y = height / 2;
  body.castShadow = true;
  body.receiveShadow = true;
  pipe.add(body);

  const rimGeo = new THREE.CylinderGeometry(0.95, 0.95, 0.5, 16);
  const rim = new THREE.Mesh(rimGeo, MATERIALS.pipeRim);
  rim.position.y = height - 0.25;
  rim.castShadow = true;
  pipe.add(rim);

  return pipe;
}

// 3D Voxel Puffy Cloud
export function createVoxelCloud(x: number, y: number, z: number, scale: number = 1.0): THREE.Group {
  const cloud = new THREE.Group();
  cloud.position.set(x, y, z);
  cloud.scale.set(scale, scale, scale);

  const cubes = [
    { x: 0, y: 0, z: 0, sx: 3, sy: 1.2, sz: 1.8 },
    { x: -1.2, y: 0.3, z: 0, sx: 1.8, sy: 1.4, sz: 1.6 },
    { x: 1.0, y: 0.4, z: 0, sx: 2.0, sy: 1.6, sz: 1.7 },
    { x: -0.4, y: 0.8, z: 0, sx: 2.2, sy: 1.3, sz: 1.5 }
  ];

  cubes.forEach(c => {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(c.sx, c.sy, c.sz), MATERIALS.cloud);
    mesh.position.set(c.x, c.y, c.z);
    cloud.add(mesh);
  });

  return cloud;
}

// 3D Voxel Tree
export function createVoxelTree(x: number, y: number, z: number): THREE.Group {
  const tree = new THREE.Group();
  tree.position.set(x, y, z);

  // Trunk
  const trunk = new THREE.Mesh(new THREE.BoxGeometry(0.7, 2.5, 0.7), MATERIALS.treeTrunk);
  trunk.position.y = 1.25;
  trunk.castShadow = true;
  tree.add(trunk);

  // Foliage blocks (stepped pyramid voxel style)
  const layer1 = new THREE.Mesh(new THREE.BoxGeometry(2.4, 1.2, 2.4), MATERIALS.treeLeaves);
  layer1.position.y = 2.8;
  layer1.castShadow = true;
  tree.add(layer1);

  const layer2 = new THREE.Mesh(new THREE.BoxGeometry(1.8, 1.2, 1.8), MATERIALS.treeLeaves);
  layer2.position.y = 3.8;
  layer2.castShadow = true;
  tree.add(layer2);

  const layer3 = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.9, 1.0), MATERIALS.treeLeaves);
  layer3.position.y = 4.7;
  layer3.castShadow = true;
  tree.add(layer3);

  return tree;
}
