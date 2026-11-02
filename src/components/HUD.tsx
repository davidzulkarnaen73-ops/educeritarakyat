/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Volume2, VolumeX, Pause, HelpCircle } from 'lucide-react';
import { soundManager } from '../audio/soundManager';

interface HUDProps {
  score: number;
  coins: number;
  level: number;
  solvedCount: number;
  totalQuestions: number;
  onOpenHelp: () => void;
  onReturnToMenu: () => void;
}

export const HUD: React.FC<HUDProps> = ({
  score,
  coins,
  level,
  solvedCount,
  totalQuestions,
  onOpenHelp,
  onReturnToMenu
}) => {
  const [isMuted, setIsMuted] = React.useState(soundManager.getMuted());

  const handleToggleSound = () => {
    const muted = soundManager.toggleMute();
    setIsMuted(muted);
  };

  const formattedScore = score.toString().padStart(6, '0');
  const formattedCoins = coins.toString().padStart(2, '0');
  const formattedQuestions = `${solvedCount.toString().padStart(2, '0')}/${totalQuestions.toString().padStart(2, '0')}`;
  const progressPercent = Math.round((solvedCount / totalQuestions) * 100);

  return (
    <div className="absolute top-0 left-0 right-0 z-30 pointer-events-none p-2 sm:p-3">
      {/* Top HUD Banner */}
      <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-between gap-2 bg-slate-900/90 text-white px-3 sm:px-4 py-2 rounded-xl border-2 border-amber-400/80 shadow-2xl backdrop-blur-xs pointer-events-auto">
        {/* Left: Player & Level */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block"></span>
            <div className="flex flex-col">
              <span className="text-[10px] tracking-wider text-amber-300 font-mono font-bold uppercase">
                PLAYER: EDUCATION EXPLORER
              </span>
              <span className="text-xs sm:text-sm font-black text-white font-mono">
                LEVEL: {level}
              </span>
            </div>
          </div>
        </div>

        {/* Center: Score, Coin, Soal */}
        <div className="flex items-center gap-4 sm:gap-6 font-mono">
          <div className="flex flex-col items-center">
            <span className="text-[10px] text-amber-300/80 font-bold">SCORE</span>
            <span className="text-xs sm:text-sm font-black tracking-widest text-amber-300">
              {formattedScore}
            </span>
          </div>

          <div className="flex flex-col items-center">
            <span className="text-[10px] text-amber-300/80 font-bold">COIN</span>
            <div className="flex items-center gap-1">
              <span className="text-yellow-400 font-bold text-xs">🪙</span>
              <span className="text-xs sm:text-sm font-black text-yellow-300">
                {formattedCoins}
              </span>
            </div>
          </div>

          <div className="flex flex-col items-center">
            <span className="text-[10px] text-cyan-300/80 font-bold">SOAL</span>
            <span className="text-xs sm:text-sm font-black text-cyan-300">
              {formattedQuestions}
            </span>
          </div>
        </div>

        {/* Right: Progress bar & Control action buttons */}
        <div className="flex items-center gap-3">
          {/* Progress Bar */}
          <div className="hidden md:flex flex-col items-end w-24">
            <span className="text-[9px] text-emerald-300 font-mono font-bold">PROGRES {progressPercent}%</span>
            <div className="w-full bg-slate-800 rounded-full h-2 border border-slate-700 overflow-hidden">
              <div
                className="bg-gradient-to-r from-emerald-500 to-cyan-400 h-full rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={handleToggleSound}
              title={isMuted ? 'Nyalakan Suara' : 'Matikan Suara'}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-400 border border-slate-600 active:scale-95 transition-transform"
            >
              {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
            </button>
            <button
              onClick={onOpenHelp}
              title="Petunjuk Permainan"
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-600 active:scale-95 transition-transform"
            >
              <HelpCircle size={16} />
            </button>
            <button
              onClick={onReturnToMenu}
              title="Menu Utama"
              className="px-2 py-1 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs active:scale-95 transition-transform"
            >
              MENU
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
