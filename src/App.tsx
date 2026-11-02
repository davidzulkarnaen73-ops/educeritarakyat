/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useCallback } from 'react';
import { GameCanvas } from './components/GameCanvas';
import { HUD } from './components/HUD';
import { OnscreenControls } from './components/OnscreenControls';
import { QuizPanel } from './components/QuizPanel';
import { MainMenu } from './components/MainMenu';
import { InstructionsModal } from './components/InstructionsModal';
import { LevelSelectModal } from './components/LevelSelectModal';
import { ResultsScreen } from './components/ResultsScreen';
import { GameState, Question, PlayerStats } from './types/game';
import { INITIAL_QUESTIONS, LEVEL_CONFIGS } from './data/curriculumData';
import { soundManager } from './audio/soundManager';
import { Trophy, ArrowRight, RotateCcw } from 'lucide-react';

export default function App() {
  const [gameState, setGameState] = useState<GameState>('MENU');
  const [currentLevel, setCurrentLevel] = useState<number>(1);
  const [questions, setQuestions] = useState<Question[]>(() => JSON.parse(JSON.stringify(INITIAL_QUESTIONS)));
  const [activeQuizQuestion, setActiveQuizQuestion] = useState<Question | null>(null);

  const [stats, setStats] = useState<PlayerStats>({
    score: 0,
    coins: 0,
    currentLevel: 1,
    solvedQuestionsCount: 0,
    firstAttemptCorrectCount: 0,
    mistakesCount: 0,
    completedLevels: []
  });

  const [inputState, setInputState] = useState({
    left: false,
    right: false,
    up: false,
    down: false,
    jump: false
  });

  const [levelClearedModal, setLevelClearedModal] = useState<number | null>(null);

  // Trigger question modal
  const handleTriggerQuestion = useCallback((qId: string) => {
    setQuestions(prevQuestions => {
      const target = prevQuestions.find(q => q.id === qId);
      if (target && !target.solved) {
        setActiveQuizQuestion(target);
      }
      return prevQuestions;
    });
  }, []);

  // Collect coin
  const handleCollectCoin = useCallback((isEdu: boolean) => {
    setStats(prev => ({
      ...prev,
      coins: prev.coins + 1,
      score: prev.score + (isEdu ? 0 : 10) // Edu coin points given upon correct question answer (+100)
    }));
  }, []);

  // Handle correct answer
  const handleAnswerCorrect = useCallback((questionId: string, firstTry: boolean) => {
    setQuestions(prev =>
      prev.map(q => {
        if (q.id === questionId && !q.solved) {
          return {
            ...q,
            solved: true,
            attempts: q.attempts + 1,
            firstAttemptCorrect: firstTry
          };
        }
        return q;
      })
    );

    setStats(prev => {
      const alreadySolved = questions.find(q => q.id === questionId)?.solved;
      if (alreadySolved) return prev;

      return {
        ...prev,
        score: prev.score + 100,
        solvedQuestionsCount: prev.solvedQuestionsCount + 1,
        firstAttemptCorrectCount: firstTry
          ? prev.firstAttemptCorrectCount + 1
          : prev.firstAttemptCorrectCount
      };
    });
  }, [questions]);

  // Handle wrong answer
  const handleAnswerWrong = useCallback((questionId: string) => {
    setQuestions(prev =>
      prev.map(q => {
        if (q.id === questionId) {
          return {
            ...q,
            attempts: q.attempts + 1,
            firstAttemptCorrect: false
          };
        }
        return q;
      })
    );

    setStats(prev => ({
      ...prev,
      mistakesCount: prev.mistakesCount + 1
    }));
  }, []);

  // Close quiz panel & resume game
  const handleCloseQuiz = useCallback(() => {
    setActiveQuizQuestion(null);
  }, []);

  // Level complete handler
  const handleLevelComplete = useCallback((clearedLvl: number) => {
    setStats(prev => ({
      ...prev,
      completedLevels: Array.from(new Set([...prev.completedLevels, clearedLvl]))
    }));

    if (clearedLvl >= 3) {
      // Reached final castle! Open Results screen
      setTimeout(() => {
        setGameState('RESULTS');
      }, 1000);
    } else {
      // Show Level Cleared dialog
      setLevelClearedModal(clearedLvl);
    }
  }, []);

  // Advance to next level
  const handleNextLevel = () => {
    if (levelClearedModal !== null) {
      const nextLvl = levelClearedModal + 1;
      setLevelClearedModal(null);
      if (nextLvl <= 3) {
        setCurrentLevel(nextLvl);
      } else {
        setGameState('RESULTS');
      }
    }
  };

  // Reset entire game session (Main Lagi)
  const handlePlayAgain = () => {
    setQuestions(JSON.parse(JSON.stringify(INITIAL_QUESTIONS)));
    setStats({
      score: 0,
      coins: 0,
      currentLevel: 1,
      solvedQuestionsCount: 0,
      firstAttemptCorrectCount: 0,
      mistakesCount: 0,
      completedLevels: []
    });
    setCurrentLevel(1);
    setActiveQuizQuestion(null);
    setLevelClearedModal(null);
    setGameState('PLAYING');
  };

  // Replay current level
  const handleReplayLevel = () => {
    setActiveQuizQuestion(null);
    setLevelClearedModal(null);
    // Reload current level
    const lvl = currentLevel;
    setCurrentLevel(0);
    setTimeout(() => {
      setCurrentLevel(lvl);
      setGameState('PLAYING');
    }, 50);
  };

  return (
    <div className="w-screen h-screen bg-slate-950 flex items-center justify-center overflow-hidden font-sans select-none">
      {/* 16:9 Landscape Game Container */}
      <div className="w-full h-full max-w-[177.78vh] max-h-[56.25vw] relative overflow-hidden bg-slate-900 shadow-2xl flex flex-col">
        {/* 3D Game Canvas Viewport */}
        <GameCanvas
          currentLevel={currentLevel}
          questions={questions}
          inputState={inputState}
          onTriggerQuestion={handleTriggerQuestion}
          onCollectCoin={handleCollectCoin}
          onLevelComplete={handleLevelComplete}
          quizActive={activeQuizQuestion !== null}
        />

        {/* HUD (Always active during PLAYING) */}
        {gameState === 'PLAYING' && (
          <HUD
            score={stats.score}
            coins={stats.coins}
            level={currentLevel}
            solvedCount={stats.solvedQuestionsCount}
            totalQuestions={15}
            onOpenHelp={() => setGameState('INSTRUCTIONS')}
            onReturnToMenu={() => setGameState('MENU')}
          />
        )}

        {/* Onscreen Controls (Always visible in game viewport) */}
        {gameState === 'PLAYING' && (
          <OnscreenControls onInputStateChange={setInputState} />
        )}

        {/* Top-Center Compact Quiz Panel (3D world & character stay 100% visible) */}
        {gameState === 'PLAYING' && activeQuizQuestion && (
          <QuizPanel
            question={activeQuizQuestion}
            onAnswerCorrect={handleAnswerCorrect}
            onAnswerWrong={handleAnswerWrong}
            onCloseAndContinue={handleCloseQuiz}
          />
        )}

        {/* Level Cleared Transition Modal */}
        {levelClearedModal !== null && (
          <div className="absolute inset-0 z-40 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
            <div className="w-full max-w-md bg-slate-900 border-2 border-amber-400 rounded-2xl p-5 text-center text-white shadow-2xl">
              <div className="inline-flex p-3 rounded-full bg-amber-500/20 border-2 border-amber-400 mb-2">
                <Trophy size={32} className="text-amber-400" />
              </div>
              <h2 className="text-xl sm:text-2xl font-black font-mono text-amber-300">
                LEVEL {levelClearedModal} SELESAI!
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 mt-1">
                Kastel berhasil dicapai! Siapkan dirimu untuk petualangan materi berikutnya.
              </p>
              <div className="mt-5 flex gap-2 justify-center">
                <button
                  onClick={handleReplayLevel}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs font-mono border border-slate-600 flex items-center gap-1.5"
                >
                  <RotateCcw size={15} />
                  <span>Ulangi</span>
                </button>
                <button
                  onClick={handleNextLevel}
                  className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs sm:text-sm font-mono flex items-center gap-1.5 shadow-md active:scale-95 transition-all"
                >
                  <span>LANJUT KE LEVEL {levelClearedModal + 1}</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Main Menu Screen */}
        {gameState === 'MENU' && (
          <MainMenu
            onStartGame={() => {
              setCurrentLevel(1);
              setGameState('PLAYING');
            }}
            onOpenInstructions={() => setGameState('INSTRUCTIONS')}
            onOpenLevelSelect={() => setGameState('LEVEL_SELECT')}
          />
        )}

        {/* Instructions Modal */}
        {gameState === 'INSTRUCTIONS' && (
          <InstructionsModal
            onClose={() => setGameState('PLAYING')}
          />
        )}

        {/* Level Select Modal */}
        {gameState === 'LEVEL_SELECT' && (
          <LevelSelectModal
            completedLevels={stats.completedLevels}
            currentLevel={currentLevel}
            onSelectLevel={(lvlId) => {
              setCurrentLevel(lvlId);
              setGameState('PLAYING');
            }}
            onClose={() => setGameState('MENU')}
          />
        )}

        {/* Results Screen */}
        {gameState === 'RESULTS' && (
          <ResultsScreen
            score={stats.score}
            coins={stats.coins}
            solvedCount={stats.solvedQuestionsCount}
            firstAttemptCorrectCount={stats.firstAttemptCorrectCount}
            mistakesCount={stats.mistakesCount}
            onPlayAgain={handlePlayAgain}
            onReplayLevel={handleReplayLevel}
            onBackToMenu={() => setGameState('MENU')}
          />
        )}
      </div>
    </div>
  );
}
