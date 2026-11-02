/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { X, Lock, CheckCircle2, Play, Sparkles } from 'lucide-react';
import { LEVEL_CONFIGS } from '../data/curriculumData';

interface LevelSelectModalProps {
  completedLevels: number[];
  currentLevel: number;
  onSelectLevel: (levelId: number) => void;
  onClose: () => void;
}

export const LevelSelectModal: React.FC<LevelSelectModalProps> = ({
  completedLevels,
  currentLevel,
  onSelectLevel,
  onClose
}) => {
  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
      <div className="w-full max-w-lg bg-slate-900 border-2 border-amber-400 rounded-2xl shadow-2xl text-white overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-700 bg-slate-800/80">
          <div className="flex items-center gap-2">
            <Sparkles size={20} className="text-amber-400" />
            <h2 className="text-base sm:text-lg font-black font-mono text-amber-300">
              PILIH TANTANGAN LEVEL
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-white"
          >
            <X size={18} />
          </button>
        </div>

        {/* Level List */}
        <div className="p-4 sm:p-5 space-y-3">
          {LEVEL_CONFIGS.map(lvl => {
            const isCompleted = completedLevels.includes(lvl.id);
            // Level 1 is always unlocked; Level 2 unlocked if Level 1 completed; Level 3 unlocked if Level 2 completed
            const isUnlocked = lvl.id === 1 || completedLevels.includes(lvl.id - 1);
            const isCurrent = currentLevel === lvl.id;

            return (
              <div
                key={lvl.id}
                className={`flex items-center justify-between p-3.5 rounded-xl border transition-all ${
                  isUnlocked
                    ? 'bg-slate-800/80 hover:bg-slate-800 border-amber-400/60 shadow-md cursor-pointer'
                    : 'bg-slate-950/50 border-slate-800 opacity-60 cursor-not-allowed'
                }`}
                onClick={() => {
                  if (isUnlocked) onSelectLevel(lvl.id);
                }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-11 h-11 rounded-lg flex items-center justify-center font-black font-mono text-base ${
                      isUnlocked
                        ? 'bg-amber-500 text-slate-950 shadow-md'
                        : 'bg-slate-800 text-slate-500'
                    }`}
                  >
                    {isUnlocked ? lvl.id : <Lock size={18} />}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-amber-300 font-mono">
                        {lvl.title} — {lvl.subtitle}
                      </span>
                      {isCompleted && (
                        <CheckCircle2 size={15} className="text-emerald-400" />
                      )}
                    </div>
                    <p className="text-xs text-slate-300 line-clamp-1 mt-0.5">
                      {lvl.description}
                    </p>
                  </div>
                </div>

                <div>
                  {isUnlocked ? (
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        onSelectLevel(lvl.id);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1 active:scale-95 transition-transform"
                    >
                      <Play size={14} className="fill-slate-950" />
                      <span>{isCurrent ? 'LANJUT' : 'MAIN'}</span>
                    </button>
                  ) : (
                    <span className="text-[11px] text-slate-500 font-mono flex items-center gap-1">
                      <Lock size={13} /> TERKUNCI
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer info */}
        <div className="p-3 bg-slate-800/60 border-t border-slate-700 text-center text-xs text-slate-400">
          Selesaikan setiap level untuk membuka kunci level petualangan berikutnya.
        </div>
      </div>
    </div>
  );
};
