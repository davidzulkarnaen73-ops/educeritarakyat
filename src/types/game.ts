/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type GameState = 'MENU' | 'PLAYING' | 'INSTRUCTIONS' | 'LEVEL_SELECT' | 'RESULTS';

export type CharacterAction = 'IDLE' | 'WALK' | 'RUN' | 'JUMP' | 'LAND' | 'CELEBRATE_CORRECT' | 'CELEBRATE_WIN';

export interface Question {
  id: string; // e.g. "Q1", "Q2", ... "Q15"
  level: number; // 1, 2, or 3
  topic: string; // Specific sub-topic
  question: string;
  options: [string, string, string, string]; // [A, B, C, D]
  correctAnswer: 0 | 1 | 2 | 3; // Index of correct option (0=A, 1=B, 2=C, 3=D)
  explanation: string;
  hint: string;
  solved: boolean;
  attempts: number;
  firstAttemptCorrect: boolean | null;
}

export interface PlayerStats {
  score: number;
  coins: number;
  currentLevel: number;
  solvedQuestionsCount: number;
  firstAttemptCorrectCount: number;
  mistakesCount: number;
  completedLevels: number[];
}

export interface LevelConfig {
  id: number;
  title: string;
  subtitle: string;
  theme: 'GRASSLAND' | 'BRIDGE' | 'CASTLE';
  description: string;
  worldLength: number;
  targetQuestions: string[]; // Question IDs for this level
  bgColor: string;
  fogColor: string;
}
