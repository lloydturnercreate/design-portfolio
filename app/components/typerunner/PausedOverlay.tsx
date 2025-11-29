/**
 * Paused overlay with keyboard guide
 */

import { Play, RotateCcw, LogOut } from 'lucide-react';
import { GameMode } from '@/lib/typerunner/types';
import KeyboardGuide from './KeyboardGuide';

interface PausedOverlayProps {
  activeKey: string | null;
  gameMode: GameMode;
  onResume: () => void;
  onRestart: () => void;
  onQuit: () => void;
}

export default function PausedOverlay({
  activeKey,
  gameMode,
  onResume,
  onRestart,
  onQuit,
}: PausedOverlayProps) {
  return (
    <div className="absolute inset-0 z-40 flex items-center justify-center backdrop-blur-sm bg-black/80">
      <div className="bg-[#120024] border-2 border-cyan-500 p-8 rounded-xl shadow-[0_0_50px_rgba(0,255,255,0.3)] w-full max-w-lg animate-in zoom-in duration-200">
        <h2 className="text-3xl font-black italic text-center text-white mb-6 tracking-wide border-b border-gray-700 pb-4">
          SYSTEM PAUSED
        </h2>

        {/* Finger Guide */}
        <div className="mb-8">
          <div className="text-xs text-center text-gray-400 mb-2 uppercase tracking-widest">
            Touch Typing Guide
          </div>
          <KeyboardGuide activeKey={activeKey} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={onResume}
            className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-4 rounded shadow-[0_4px_0_#155e75] active:shadow-none active:translate-y-1 transition-all flex items-center justify-center gap-2"
          >
            <Play fill="currentColor" size={20} /> RESUME
          </button>

          <div className="flex flex-col gap-2">
            <button
              onClick={onRestart}
              className="bg-gray-800 hover:bg-gray-700 text-gray-300 font-bold py-2 rounded flex items-center justify-center gap-2 text-sm"
            >
              <RotateCcw size={16} /> RESTART
            </button>
            <button
              onClick={onQuit}
              className="bg-red-900/50 hover:bg-red-900 text-red-300 font-bold py-2 rounded flex items-center justify-center gap-2 text-sm"
            >
              <LogOut size={16} /> QUIT TO TITLE
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

