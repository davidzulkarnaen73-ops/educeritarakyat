/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { Trophy, Star, RotateCcw, Home, Repeat, CheckCircle, Award } from 'lucide-react';
import { CURRICULUM_INFO } from '../data/curriculumData';
import confetti from 'canvas-confetti';
import { soundManager } from '../audio/soundManager';

interface ResultsScreenProps {
  score: number;
  coins: number;
  solvedCount: number;
  firstAttemptCorrectCount: number;
  mistakesCount: number;
  onPlayAgain: () => void;
  onReplayLevel: () => void;
  onBackToMenu: () => void;
}

export const ResultsScreen: React.FC<ResultsScreenProps> = ({
  score,
  coins,
  solvedCount,
  firstAttemptCorrectCount,
  mistakesCount,
  onPlayAgain,
  onReplayLevel,
  onBackToMenu
}) => {
  const TOTAL_QUESTIONS = 15;

  // Exact formulas from prompt:
  // Keberhasilan percobaan pertama: (jumlah soal benar percobaan pertama / 15) * 100%
  const firstAttemptPercentage = Math.round((firstAttemptCorrectCount / TOTAL_QUESTIONS) * 100);

  // Nilai penyelesaian akhir: (jumlah soal yang berhasil diselesaikan / 15) * 100%
  const completionPercentage = Math.round((solvedCount / TOTAL_QUESTIONS) * 100);

  // Category based on firstAttemptPercentage:
  // 90–100: SUPER CHAMPION!
  // 80–89: GOLD ADVENTURER!
  // 70–79: SMART EXPLORER!
  // Di bawah 70: KEEP PRACTICING!
  let categoryTitle = 'KEEP PRACTICING!';
  let categoryColor = 'text-amber-400';
  let motivationMsg = 'Teruslah berlatih membaca cerita rakyat dan memaknai bahasa kiasan. Usaha kerasmu akan membuahkan hasil luar biasa!';
  let stars = 2;

  if (firstAttemptPercentage >= 90) {
    categoryTitle = 'SUPER CHAMPION!';
    categoryColor = 'text-yellow-300';
    motivationMsg = 'Luar biasa sempurna! Kamu telah menguasai cerita rakyat, nilai-nilai moral luhur, dan membedakan makna konotatif-denotatif dengan cemerlang!';
    stars = 5;
  } else if (firstAttemptPercentage >= 80) {
    categoryTitle = 'GOLD ADVENTURER!';
    categoryColor = 'text-amber-300';
    motivationMsg = 'Hebat sekali! Pemahamanmu tentang teks sastra bergambar dan pesan moral cerita rakyat sangat tajam!';
    stars = 4;
  } else if (firstAttemptPercentage >= 70) {
    categoryTitle = 'SMART EXPLORER!';
    categoryColor = 'text-teal-300';
    motivationMsg = 'Bagus! Kamu berhasil menaklukkan tantangan kuis dengan pemahaman yang baik!';
    stars = 3;
  }

  useEffect(() => {
    soundManager.playVictory();
    try {
      confetti({
        particleCount: 80,
        spread: 90,
        origin: { y: 0.4 }
      });
    } catch {
      // Fallback
    }
  }, []);

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-gradient-to-b from-slate-950 via-indigo-950 to-slate-950 text-white overflow-y-auto">
      <div className="w-full max-w-2xl bg-slate-900/95 border-2 border-amber-400 rounded-2xl shadow-2xl p-4 sm:p-6 my-auto">
        {/* Header */}
        <div className="text-center pb-4 border-b border-slate-700">
          <div className="inline-flex p-3 rounded-full bg-amber-500/20 border-2 border-amber-400 mb-2">
            <Trophy size={36} className="text-amber-400 animate-bounce" />
          </div>
          <h1 className="text-xl sm:text-3xl font-black font-mono tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-500">
            SELAMAT! PETUALANGAN SELESAI!
          </h1>
          <p className="text-xs sm:text-sm font-semibold text-slate-300 mt-1">
            Kamu telah menaklukkan seluruh tantangan pembelajaran di Kastel Juara!
          </p>

          {/* Star Rating */}
          <div className="flex items-center justify-center gap-1.5 mt-3">
            {[1, 2, 3, 4, 5].map(s => (
              <Star
                key={s}
                size={24}
                className={s <= stars ? 'text-amber-400 fill-amber-400' : 'text-slate-600'}
              />
            ))}
          </div>

          {/* Category Badge */}
          <div className="mt-2.5">
            <span className={`inline-block px-4 py-1 rounded-full bg-slate-800 border border-amber-400/60 font-mono font-black text-xs sm:text-sm tracking-wider uppercase ${categoryColor}`}>
              🏆 {categoryTitle}
            </span>
          </div>
        </div>

        {/* Learning Configuration Context */}
        <div className="my-3 p-3 rounded-xl bg-slate-800/60 border border-slate-700 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-300">
            <div>
              <span className="text-slate-400 block text-[11px]">Mata Pelajaran:</span>
              <span className="font-bold text-amber-300">{CURRICULUM_INFO.subject}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Kelas & Fase:</span>
              <span className="font-bold text-amber-300">{CURRICULUM_INFO.gradeLevel} ({CURRICULUM_INFO.phase})</span>
            </div>
          </div>
          <div className="mt-2 pt-2 border-t border-slate-700/80">
            <span className="text-slate-400 block text-[11px]">Materi Pelajaran:</span>
            <span className="font-medium text-slate-200 text-[11px] leading-tight block">
              Cerita Rakyat (Fabel, Legenda, Mite, Sage), Teks Sastra Bergambar, Nilai Moral, dan Makna Konotatif/Denotatif
            </span>
          </div>
        </div>

        {/* Detailed Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 my-3 text-center">
          {/* Total Game Score */}
          <div className="p-2.5 rounded-xl bg-slate-800/80 border border-amber-500/40">
            <span className="text-[10px] text-amber-300/80 font-mono font-bold block">TOTAL SKOR</span>
            <span className="text-lg sm:text-xl font-black text-amber-300 font-mono">
              {score.toString().padStart(6, '0')}
            </span>
          </div>

          {/* Total Coins */}
          <div className="p-2.5 rounded-xl bg-slate-800/80 border border-yellow-500/40">
            <span className="text-[10px] text-yellow-300/80 font-mono font-bold block">KOIN DIKUMPULKAN</span>
            <span className="text-lg sm:text-xl font-black text-yellow-300 font-mono">
              🪙 {coins}
            </span>
          </div>

          {/* Solved Questions */}
          <div className="p-2.5 rounded-xl bg-slate-800/80 border border-cyan-500/40">
            <span className="text-[10px] text-cyan-300/80 font-mono font-bold block">SOAL DISELESAIKAN</span>
            <span className="text-lg sm:text-xl font-black text-cyan-300 font-mono">
              {solvedCount} / {TOTAL_QUESTIONS}
            </span>
          </div>

          {/* First Attempt Correct */}
          <div className="p-2.5 rounded-xl bg-slate-800/80 border border-emerald-500/40">
            <span className="text-[10px] text-emerald-300/80 font-mono font-bold block">BENAR PERCOBAAN I</span>
            <span className="text-base sm:text-lg font-black text-emerald-300 font-mono">
              {firstAttemptCorrectCount} Soal
            </span>
          </div>

          {/* Mistakes Made */}
          <div className="p-2.5 rounded-xl bg-slate-800/80 border border-rose-500/40">
            <span className="text-[10px] text-rose-300/80 font-mono font-bold block">SEMPAT SALAH</span>
            <span className="text-base sm:text-lg font-black text-rose-300 font-mono">
              {mistakesCount} Kali
            </span>
          </div>

          {/* First Attempt Success Rate */}
          <div className="p-2.5 rounded-xl bg-slate-800/80 border border-indigo-500/40">
            <span className="text-[10px] text-indigo-300/80 font-mono font-bold block">AKURASI PERTAMA</span>
            <span className="text-base sm:text-lg font-black text-indigo-300 font-mono">
              {firstAttemptPercentage}%
            </span>
          </div>
        </div>

        {/* Completion vs First-Attempt Analysis */}
        <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-xs mb-4">
          <div className="flex items-center justify-between mb-1">
            <span className="font-bold text-emerald-300 flex items-center gap-1">
              <CheckCircle size={14} /> Nilai Penyelesaian Akhir:
            </span>
            <span className="font-mono font-black text-emerald-200">{completionPercentage}%</span>
          </div>
          <p className="text-[11px] text-slate-300 leading-relaxed">
            {motivationMsg}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 pt-2 border-t border-slate-700">
          <button
            onClick={onPlayAgain}
            className="flex-1 min-w-[130px] flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm font-mono shadow-md active:scale-95 transition-all"
          >
            <RotateCcw size={16} />
            <span>MAIN LAGI</span>
          </button>

          <button
            onClick={onReplayLevel}
            className="flex-1 min-w-[130px] flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 font-bold text-xs sm:text-sm font-mono border border-cyan-400/50 active:scale-95 transition-all"
          >
            <Repeat size={16} />
            <span>ULANGI LEVEL</span>
          </button>

          <button
            onClick={onBackToMenu}
            className="flex-1 min-w-[130px] flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs sm:text-sm font-mono border border-slate-600 active:scale-95 transition-all"
          >
            <Home size={16} />
            <span>KEMBALI KE MENU</span>
          </button>
        </div>
      </div>
    </div>
  );
};
