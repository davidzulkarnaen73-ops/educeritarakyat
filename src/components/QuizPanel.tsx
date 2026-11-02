/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Question } from '../types/game';
import { soundManager } from '../audio/soundManager';
import confetti from 'canvas-confetti';
import { Sparkles, HelpCircle, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';

interface QuizPanelProps {
  question: Question;
  onAnswerCorrect: (questionId: string, firstTry: boolean) => void;
  onAnswerWrong: (questionId: string) => void;
  onCloseAndContinue: () => void;
}

export const QuizPanel: React.FC<QuizPanelProps> = ({
  question,
  onAnswerCorrect,
  onAnswerWrong,
  onCloseAndContinue
}) => {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [status, setStatus] = useState<'IDLE' | 'CORRECT' | 'WRONG'>('IDLE');
  const [wrongAttempts, setWrongAttempts] = useState(0);

  const handleSelectOption = (idx: number) => {
    if (status === 'CORRECT') return; // Locked once answered correctly
    setSelectedOption(idx);

    if (idx === question.correctAnswer) {
      // CORRECT
      setStatus('CORRECT');
      soundManager.playCorrect();
      // Confetti burst
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.3 }
        });
      } catch {
        // Safe fallback
      }
      onAnswerCorrect(question.id, wrongAttempts === 0 && (question.attempts === 0));
    } else {
      // WRONG
      setStatus('WRONG');
      soundManager.playWrong();
      setWrongAttempts(prev => prev + 1);
      onAnswerWrong(question.id);
    }
  };

  const optionLabels = ['A', 'B', 'C', 'D'];

  return (
    <>
      {/* Light subtle transparent tint (0.2 opacity max) to keep 3D world and character 100% visible */}
      <div className="absolute inset-0 bg-slate-950/20 pointer-events-none z-10" />

      {/* Compact Quiz Panel positioned at Top-Center beneath HUD */}
      <div
        className="quiz-panel absolute top-[68px] sm:top-[76px] left-1/2 -translate-x-1/2 w-[min(410px,calc(100%-24px))] max-h-[calc(100%-140px)] overflow-y-auto bg-slate-900/95 border-2 border-amber-400 rounded-xl shadow-[0_12px_36px_rgba(0,0,0,0.6)] p-3 sm:p-4 z-20 text-white font-sans backdrop-blur-xs transition-all duration-200"
      >
        {/* Header: Level & Question badge */}
        <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-700/80">
          <div className="flex items-center gap-1.5">
            <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono text-[11px] font-bold border border-amber-400/40">
              LEVEL {question.level} — SOAL {question.id}
            </span>
          </div>
          <span className="text-[11px] font-medium text-slate-400 truncate max-w-[150px]">
            {question.topic}
          </span>
        </div>

        {/* Question Text */}
        <div className="my-2">
          <p className="text-xs sm:text-sm font-semibold text-slate-100 leading-snug">
            {question.question}
          </p>
        </div>

        {/* Options: 2 columns on desktop/tablet, compact buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 my-3">
          {question.options.map((opt, idx) => {
            const isSelected = selectedOption === idx;
            const isCorrectOption = idx === question.correctAnswer;
            let btnStyle = 'bg-amber-50/95 hover:bg-amber-100 text-slate-900 border-amber-300 hover:border-amber-400';

            if (status === 'CORRECT') {
              if (isCorrectOption) {
                btnStyle = 'bg-emerald-500 text-white border-emerald-400 ring-2 ring-emerald-300 font-bold';
              } else if (isSelected) {
                btnStyle = 'bg-slate-700/70 text-slate-400 border-slate-600 opacity-60';
              } else {
                btnStyle = 'bg-slate-800/60 text-slate-400 border-slate-700 opacity-50';
              }
            } else if (status === 'WRONG' && isSelected) {
              btnStyle = 'bg-rose-500 text-white border-rose-400 animate-pulse';
            }

            return (
              <button
                key={idx}
                onClick={() => handleSelectOption(idx)}
                disabled={status === 'CORRECT'}
                className={`flex items-start gap-2 p-2 sm:p-2.5 rounded-lg border text-left text-xs transition-all active:scale-98 shadow-sm ${btnStyle}`}
              >
                <span className="inline-flex items-center justify-center w-5 h-5 rounded-md bg-slate-900/10 font-bold font-mono text-[11px] shrink-0">
                  {optionLabels[idx]}
                </span>
                <span className="line-clamp-3 font-medium leading-tight">
                  {opt}
                </span>
              </button>
            );
          })}
        </div>

        {/* Feedback Section */}
        {status === 'CORRECT' && (
          <div className="mt-2.5 p-2.5 rounded-lg bg-emerald-950/80 border border-emerald-500/80 text-emerald-100 text-xs">
            <div className="flex items-center gap-1.5 font-bold text-emerald-300 text-xs sm:text-sm mb-1">
              <Sparkles size={16} className="text-yellow-400 animate-spin" />
              <span>HEBAT! JAWABAN BENAR! (+100 Poin)</span>
            </div>
            <p className="text-[11px] leading-relaxed text-emerald-200/90 mb-2.5">
              {question.explanation}
            </p>
            <button
              onClick={onCloseAndContinue}
              className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-xs shadow-md active:scale-95 transition-transform"
            >
              <span>LANJUTKAN PETUALANGAN</span>
              <ArrowRight size={14} />
            </button>
          </div>
        )}

        {status === 'WRONG' && (
          <div className="mt-2.5 p-2 rounded-lg bg-rose-950/80 border border-rose-500/70 text-rose-100 text-xs">
            <div className="flex items-center gap-1.5 font-bold text-rose-300 text-xs mb-1">
              <AlertCircle size={15} />
              <span>COBA LAGI, KAMU PASTI BISA!</span>
            </div>
            <div className="flex items-start gap-1 text-[11px] text-amber-200 bg-amber-950/40 p-1.5 rounded border border-amber-700/50">
              <HelpCircle size={13} className="shrink-0 mt-0.5 text-amber-400" />
              <span><strong>Petunjuk:</strong> {question.hint}</span>
            </div>
          </div>
        )}
      </div>
    </>
  );
};
