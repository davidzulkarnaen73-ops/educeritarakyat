/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef } from 'react';
import { GameEngine } from '../game/GameEngine';
import { Question } from '../types/game';

interface GameCanvasProps {
  currentLevel: number;
  questions: Question[];
  inputState: {
    left: boolean;
    right: boolean;
    up: boolean;
    down: boolean;
    jump: boolean;
  };
  onTriggerQuestion: (questionId: string) => void;
  onCollectCoin: (isEdu: boolean) => void;
  onLevelComplete: (level: number) => void;
  quizActive: boolean;
}

export const GameCanvas: React.FC<GameCanvasProps> = ({
  currentLevel,
  questions,
  inputState,
  onTriggerQuestion,
  onCollectCoin,
  onLevelComplete,
  quizActive
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<GameEngine | null>(null);

  // Initialize engine once on mount
  useEffect(() => {
    if (!mountRef.current) return;

    const engine = new GameEngine(mountRef.current, {
      onTriggerQuestion: (qId) => onTriggerQuestion(qId),
      onCollectCoin: (isEdu) => onCollectCoin(isEdu),
      onLevelComplete: (lvl) => onLevelComplete(lvl)
    });

    engineRef.current = engine;
    engine.loadLevel(currentLevel, questions);

    return () => {
      engine.cleanup();
      engineRef.current = null;
    };
  }, []);

  // When level changes, reload world in existing engine
  useEffect(() => {
    if (engineRef.current) {
      engineRef.current.loadLevel(currentLevel, questions);
    }
  }, [currentLevel]);

  // Forward input states to the engine
  useEffect(() => {
    if (engineRef.current) {
      engineRef.current.input = { ...inputState };
    }
  }, [inputState]);

  // Handle quiz pause
  useEffect(() => {
    if (engineRef.current) {
      if (quizActive) {
        engineRef.current.pauseForQuiz();
      } else {
        engineRef.current.isQuizPaused = false;
      }
    }
  }, [quizActive]);

  return (
    <div
      ref={mountRef}
      className="game-viewport w-full h-full relative select-none overflow-hidden"
    />
  );
};
