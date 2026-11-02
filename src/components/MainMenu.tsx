/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Play, BookOpen, Layers, Award, Sparkles, Volume2, VolumeX } from 'lucide-react';
import { CURRICULUM_INFO } from '../data/curriculumData';
import { soundManager } from '../audio/soundManager';

interface MainMenuProps {
  onStartGame: () => void;
  onOpenInstructions: () => void;
  onOpenLevelSelect: () => void;
}

export const MainMenu: React.FC<MainMenuProps> = ({
  onStartGame,
  onOpenInstructions,
  onOpenLevelSelect
}) => {
  const [isMuted, setIsMuted] = React.useState(soundManager.getMuted());

  const handleToggleSound = () => {
    const muted = soundManager.toggleMute();
    setIsMuted(muted);
  };

  return (
    <div className="absolute inset-0 z-40 flex flex-col items-center justify-between p-4 sm:p-6 bg-gradient-to-b from-sky-900 via-indigo-950 to-slate-950 text-white overflow-y-auto">
      {/* Background visual accents */}
      <div className="absolute inset-0 bg-[radial-gradient(#ecc94b_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />

      {/* Top Bar with Audio & Badge */}
      <div className="w-full max-w-4xl flex items-center justify-between z-10">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/80 border border-amber-400/50 backdrop-blur-xs">
          <Award size={16} className="text-amber-400" />
          <span className="text-xs font-bold text-amber-300 font-mono tracking-wider">
            FASE C • SD KELAS 6
          </span>
        </div>

        <button
          onClick={handleToggleSound}
          className="p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-amber-400 border border-slate-700 transition-colors"
          title={isMuted ? 'Nyalakan Audio' : 'Matikan Audio'}
        >
          {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
        </button>
      </div>

      {/* Center Branding & Hero */}
      <div className="w-full max-w-3xl flex flex-col items-center text-center my-auto py-4 z-10">
        {/* Animated Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/20 border border-amber-400 text-amber-300 text-xs sm:text-sm font-black mb-3">
          <Sparkles size={16} className="text-yellow-400" />
          <span>UNIVERSAL EDUCATIONAL PLATFORMER GAME</span>
        </div>

        {/* Title */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-amber-200 via-amber-400 to-amber-600 drop-shadow-[0_4px_16px_rgba(245,158,11,0.4)] font-mono">
          COIN QUEST 3D
        </h1>

        {/* Tagline */}
        <p className="mt-2 text-sm sm:text-lg md:text-xl font-black text-amber-300 tracking-wide drop-shadow-sm uppercase">
          “LOMPAT, KUMPULKAN KOIN, TAKLUKKAN ILMU!”
        </p>

        {/* Curriculum Card */}
        <div className="mt-5 w-full max-w-xl bg-slate-900/85 border-2 border-amber-400/60 rounded-2xl p-4 text-left shadow-2xl backdrop-blur-xs">
          <div className="flex items-center justify-between pb-2 mb-2.5 border-b border-slate-700">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
              {CURRICULUM_INFO.subject} • {CURRICULUM_INFO.gradeLevel} ({CURRICULUM_INFO.phase})
            </span>
            <span className="text-[11px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/40">
              15 Soal Interaktif
            </span>
          </div>

          <p className="text-xs font-semibold text-slate-300 mb-1.5">Materi Pembelajaran:</p>
          <ul className="text-xs text-slate-300/90 space-y-1 list-disc list-inside">
            {CURRICULUM_INFO.topics.map((t, idx) => (
              <li key={idx} className="line-clamp-1">{t}</li>
            ))}
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3 w-full max-w-md">
          {/* Main Play Button */}
          <button
            onClick={() => {
              soundManager.playCoin();
              onStartGame();
            }}
            className="w-full sm:w-auto flex-1 min-w-[200px] flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-slate-950 font-black text-sm sm:text-base font-mono shadow-[0_6px_20px_rgba(245,158,11,0.5)] active:scale-95 transition-all"
          >
            <Play size={20} className="fill-slate-950" />
            <span>MULAI BERMAIN</span>
          </button>

          {/* Instructions Button */}
          <button
            onClick={() => {
              soundManager.playBump();
              onOpenInstructions();
            }}
            className="flex-1 min-w-[130px] flex items-center justify-center gap-1.5 py-3 px-4 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-amber-300 font-bold text-xs sm:text-sm border-2 border-slate-600 hover:border-amber-400 active:scale-95 transition-all"
          >
            <BookOpen size={17} />
            <span>PETUNJUK</span>
          </button>

          {/* Level Select Button */}
          <button
            onClick={() => {
              soundManager.playBump();
              onOpenLevelSelect();
            }}
            className="flex-1 min-w-[130px] flex items-center justify-center gap-1.5 py-3 px-4 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-cyan-300 font-bold text-xs sm:text-sm border-2 border-slate-600 hover:border-cyan-400 active:scale-95 transition-all"
          >
            <Layers size={17} />
            <span>PILIH LEVEL</span>
          </button>
        </div>
      </div>

      {/* Footer Info */}
      <div className="w-full max-w-4xl text-center py-2 text-[11px] text-slate-400 z-10">
        3D Pixel Art Voxel Platformer • Kurikulum Merdeka Fase C • Teruji Bebas Lag & Touch Ready
      </div>
    </div>
  );
};
