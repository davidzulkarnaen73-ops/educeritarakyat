/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { X, ArrowRight, BookOpen, HelpCircle, Trophy } from 'lucide-react';

interface InstructionsModalProps {
  onClose: () => void;
}

export const InstructionsModal: React.FC<InstructionsModalProps> = ({ onClose }) => {
  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
      <div className="w-full max-w-xl max-h-[90vh] flex flex-col bg-slate-900 border-2 border-amber-400 rounded-2xl shadow-2xl text-white overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-700 bg-slate-800/80">
          <div className="flex items-center gap-2">
            <BookOpen size={20} className="text-amber-400" />
            <h2 className="text-base sm:text-lg font-black font-mono text-amber-300">
              PETUNJUK PERMAINAN COIN QUEST 3D
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-white"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 text-xs sm:text-sm text-slate-200">
          {/* 1. Kontrol */}
          <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700">
            <h3 className="font-bold text-amber-400 mb-1.5 flex items-center gap-1.5">
              <span>🎮 KONTROL KARAKTER</span>
            </h3>
            <ul className="space-y-1 text-slate-300 text-xs">
              <li>• <strong>Tombol Layar:</strong> Gunakan D-Pad di kiri bawah (←, →, ↑, ↓) dan tombol <strong>JUMP</strong> di kanan bawah.</li>
              <li>• <strong>Keyboard Komputer:</strong> Tombol <strong>A / D</strong> atau <strong>Panah Kiri/Kanan</strong> untuk berlari; tombol <strong>Spasi / Panah Atas</strong> untuk melompat.</li>
              <li>• Tombol kontrol dioptimalkan agar tidak keluar dari viewport dan nyaman disentuh.</li>
            </ul>
          </div>

          {/* 2. Jenis Koin */}
          <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700">
            <h3 className="font-bold text-amber-400 mb-1.5 flex items-center gap-1.5">
              <span>🪙 KOIN & BLOK MISTERI</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/30">
                <span className="font-bold text-yellow-300 block mb-0.5">Koin Emas Biasa</span>
                <span className="text-slate-300">Memberikan +10 Poin dan menambah koleksi koin. Diambil dengan menyentuhnya.</span>
              </div>
              <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/30">
                <span className="font-bold text-cyan-300 block mb-0.5">Koin Edukasi (Biru/Bercahaya)</span>
                <span className="text-slate-300">Membuka kuis interaktif Bahasa Indonesia. Terdapat 5 koin edukasi di setiap level.</span>
              </div>
            </div>
            <p className="mt-2 text-xs text-slate-300">
              • <strong>Blok Misteri '?':</strong> Lompat dan sundul dari bawah untuk memicu soal yang belum dikerjakan!
            </p>
          </div>

          {/* 3. Panel Kuis & Skor */}
          <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700">
            <h3 className="font-bold text-amber-400 mb-1.5 flex items-center gap-1.5">
              <span>🧠 ATURAN KUIS & PENILAIAN</span>
            </h3>
            <ul className="space-y-1 text-slate-300 text-xs">
              <li>• Panel kuis berada ringkas di <strong>bagian atas tengah</strong>, sehingga karakter dan dunia 3D tetap terlihat jelas.</li>
              <li>• Jawaban benar memberikan <strong>+100 Poin</strong> (hanya 1x).</li>
              <li>• Jika salah, kamu akan diberikan petunjuk dan boleh mencoba lagi tanpa pengurangan nilai.</li>
              <li>• Skor keberhasilan percobaan pertama dihitung untuk menentukan peringkat akhir (Super Champion / Gold Adventurer / Smart Explorer).</li>
            </ul>
          </div>

          {/* 4. Menyelesaikan Level */}
          <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700">
            <h3 className="font-bold text-amber-400 mb-1.5 flex items-center gap-1.5">
              <Trophy size={16} className="text-amber-400" />
              <span>🏰 MENUJU KASTEL AKHIR</span>
            </h3>
            <p className="text-xs text-slate-300">
              Selesaikan soal dan raih kastel di ujung kanan level untuk membuka level berikutnya sampai menyelesaikan Kastel Juara di Level 3!
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-700 bg-slate-800/80 flex justify-end">
          <button
            onClick={onClose}
            className="flex items-center gap-1.5 py-2 px-5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs sm:text-sm font-mono active:scale-95 transition-transform"
          >
            <span>MENGERTI, AYO BERMAIN!</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};
