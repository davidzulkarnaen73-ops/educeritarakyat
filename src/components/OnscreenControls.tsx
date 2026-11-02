/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useCallback } from 'react';
import { ArrowLeft, ArrowRight, ArrowUp, ArrowDown, ChevronUp } from 'lucide-react';

interface OnscreenControlsProps {
  onInputStateChange: (state: {
    left: boolean;
    right: boolean;
    up: boolean;
    down: boolean;
    jump: boolean;
  }) => void;
}

export const OnscreenControls: React.FC<OnscreenControlsProps> = ({ onInputStateChange }) => {
  const inputRef = React.useRef({
    left: false,
    right: false,
    up: false,
    down: false,
    jump: false
  });

  const notifyChange = useCallback(() => {
    onInputStateChange({ ...inputRef.current });
  }, [onInputStateChange]);

  // Keyboard handlers
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Avoid intercepting if focus is in an input
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;

      let changed = false;
      if (e.code === 'ArrowLeft' || e.code === 'KeyA') {
        if (!inputRef.current.left) {
          inputRef.current.left = true;
          changed = true;
        }
      } else if (e.code === 'ArrowRight' || e.code === 'KeyD') {
        if (!inputRef.current.right) {
          inputRef.current.right = true;
          changed = true;
        }
      } else if (e.code === 'ArrowUp' || e.code === 'KeyW') {
        if (!inputRef.current.up) {
          inputRef.current.up = true;
          changed = true;
        }
      } else if (e.code === 'ArrowDown' || e.code === 'KeyS') {
        if (!inputRef.current.down) {
          inputRef.current.down = true;
          changed = true;
        }
      } else if (e.code === 'Space') {
        if (!inputRef.current.jump) {
          inputRef.current.jump = true;
          changed = true;
        }
        e.preventDefault();
      }

      if (changed) notifyChange();
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      let changed = false;
      if (e.code === 'ArrowLeft' || e.code === 'KeyA') {
        if (inputRef.current.left) {
          inputRef.current.left = false;
          changed = true;
        }
      } else if (e.code === 'ArrowRight' || e.code === 'KeyD') {
        if (inputRef.current.right) {
          inputRef.current.right = false;
          changed = true;
        }
      } else if (e.code === 'ArrowUp' || e.code === 'KeyW') {
        if (inputRef.current.up) {
          inputRef.current.up = false;
          changed = true;
        }
      } else if (e.code === 'ArrowDown' || e.code === 'KeyS') {
        if (inputRef.current.down) {
          inputRef.current.down = false;
          changed = true;
        }
      } else if (e.code === 'Space') {
        if (inputRef.current.jump) {
          inputRef.current.jump = false;
          changed = true;
        }
      }

      if (changed) notifyChange();
    };

    const handleBlur = () => {
      // Clear all inputs if window loses focus
      inputRef.current = { left: false, right: false, up: false, down: false, jump: false };
      notifyChange();
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('blur', handleBlur);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('blur', handleBlur);
    };
  }, [notifyChange]);

  // Touch / Pointer button binding helper
  const bindPointer = (action: 'left' | 'right' | 'up' | 'down' | 'jump') => ({
    onPointerDown: (e: React.PointerEvent) => {
      e.preventDefault();
      (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
      inputRef.current[action] = true;
      notifyChange();
    },
    onPointerUp: (e: React.PointerEvent) => {
      e.preventDefault();
      inputRef.current[action] = false;
      notifyChange();
    },
    onPointerCancel: () => {
      inputRef.current[action] = false;
      notifyChange();
    },
    onPointerLeave: () => {
      inputRef.current[action] = false;
      notifyChange();
    },
    onTouchStart: (e: React.TouchEvent) => e.preventDefault(),
    onContextMenu: (e: React.MouseEvent) => e.preventDefault()
  });

  return (
    <div className="absolute inset-0 pointer-events-none select-none overflow-hidden z-25">
      {/* 
        DIRECTIONAL PAD (Kiri Bawah):
        Susunan:
                 [ ATAS ]
        [ KIRI ] [ BAWAH ] [ KANAN ]
        Safe distance from bottom edge: bottom-5 sm:bottom-6 (20-24px safe area)
      */}
      <div className="absolute left-4 sm:left-6 bottom-4 sm:bottom-6 pointer-events-auto touch-none">
        <div className="grid grid-cols-3 grid-rows-2 gap-1.5 sm:gap-2 w-[160px] sm:w-[185px] h-[105px] sm:h-[120px]">
          {/* Row 1: Empty, ATAS, Empty */}
          <div />
          <button
            {...bindPointer('up')}
            aria-label="Atas / Lompat"
            className="w-13 h-13 sm:w-15 sm:h-15 mx-auto flex items-center justify-center rounded-xl bg-slate-900/85 hover:bg-slate-800 active:bg-amber-500/90 text-amber-300 active:text-slate-950 border-2 border-amber-400 shadow-[0_4px_12px_rgba(0,0,0,0.5)] active:translate-y-0.5 transition-all select-none"
          >
            <ArrowUp size={28} className="stroke-[2.5]" />
          </button>
          <div />

          {/* Row 2: KIRI, BAWAH, KANAN */}
          <button
            {...bindPointer('left')}
            aria-label="Gerak Kiri"
            className="w-13 h-13 sm:w-15 sm:h-15 flex items-center justify-center rounded-xl bg-slate-900/85 hover:bg-slate-800 active:bg-amber-500/90 text-amber-300 active:text-slate-950 border-2 border-amber-400 shadow-[0_4px_12px_rgba(0,0,0,0.5)] active:translate-y-0.5 transition-all select-none"
          >
            <ArrowLeft size={28} className="stroke-[2.5]" />
          </button>

          <button
            {...bindPointer('down')}
            aria-label="Bawah / Jongkok"
            className="w-13 h-13 sm:w-15 sm:h-15 flex items-center justify-center rounded-xl bg-slate-900/85 hover:bg-slate-800 active:bg-amber-500/90 text-amber-300 active:text-slate-950 border-2 border-amber-400 shadow-[0_4px_12px_rgba(0,0,0,0.5)] active:translate-y-0.5 transition-all select-none"
          >
            <ArrowDown size={28} className="stroke-[2.5]" />
          </button>

          <button
            {...bindPointer('right')}
            aria-label="Gerak Kanan"
            className="w-13 h-13 sm:w-15 sm:h-15 flex items-center justify-center rounded-xl bg-slate-900/85 hover:bg-slate-800 active:bg-amber-500/90 text-amber-300 active:text-slate-950 border-2 border-amber-400 shadow-[0_4px_12px_rgba(0,0,0,0.5)] active:translate-y-0.5 transition-all select-none"
          >
            <ArrowRight size={28} className="stroke-[2.5]" />
          </button>
        </div>
      </div>

      {/* 
        JUMP BUTTON (Kanan Bawah):
        Ukuran 64-72px, warna emas menyala, terpisah di kanan bawah, safe area 20-24px.
      */}
      <div className="absolute right-4 sm:right-6 bottom-4 sm:bottom-6 pointer-events-auto touch-none">
        <button
          {...bindPointer('jump')}
          aria-label="Lompat"
          className="w-16 h-16 sm:w-20 sm:h-20 flex flex-col items-center justify-center rounded-2xl bg-gradient-to-b from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 active:from-amber-600 active:to-amber-700 text-slate-950 border-3 border-amber-200 shadow-[0_6px_18px_rgba(245,158,11,0.5)] active:translate-y-1 transition-all select-none"
        >
          <ChevronUp size={28} className="stroke-[3]" />
          <span className="text-[11px] sm:text-xs font-black font-mono tracking-wider -mt-1">
            JUMP
          </span>
        </button>
      </div>

      {/* Keyboard Shortcut Hint for Desktop */}
      <div className="hidden lg:flex absolute bottom-2 left-1/2 -translate-x-1/2 items-center gap-3 text-[10px] text-white/70 font-mono bg-slate-900/60 px-3 py-1 rounded-full border border-white/10 pointer-events-none">
        <span>🎮 Kontrol: <strong>A / D / ← →</strong> Jalan</span>
        <span>•</span>
        <span><strong>Spasi / ↑</strong> Lompat</span>
      </div>
    </div>
  );
};
