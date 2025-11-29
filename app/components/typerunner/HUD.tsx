/**
 * Top navigation bar with game stats and controls
 */

import { Keyboard, Volume2, VolumeX, Menu } from 'lucide-react';
import { GameMode } from '@/lib/typerunner/types';
import { MAX_LIVES } from '@/lib/typerunner/constants';

interface HUDProps {
  score: number;
  currentLevel: number;
  multiplier: number;
  wpm: number;
  lives: number;
  isMuted: boolean;
  gameMode: GameMode;
  onToggleMute: () => void;
  onOpenMenu: () => void;
}

export default function HUD({
  score,
  currentLevel,
  multiplier,
  wpm,
  lives,
  isMuted,
  gameMode,
  onToggleMute,
  onOpenMenu,
}: HUDProps) {
  return (
    <nav className="w-full max-w-6xl z-20 flex items-center justify-between p-4 my-2 mx-4 border-b-2 border-pink-500 bg-black/40 backdrop-blur-sm relative">
      <div className="flex items-center gap-4">
        {/* Menu Button */}
        <button
          onClick={onOpenMenu}
          className="bg-purple-900 hover:bg-purple-800 p-2 rounded border border-purple-500 text-white transition-colors"
          title="Open Menu / Finger Guide"
        >
          <Menu size={24} />
        </button>

        <div className="bg-pink-600 p-2 rounded transform -skew-x-12 border-2 border-white shadow-[0_0_15px_#ff00ff]">
          <Keyboard size={24} className="text-white transform skew-x-12" />
        </div>
        <div>
          <h1
            className="font-black text-3xl tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]"
            style={{ fontFamily: 'Verdana, sans-serif', fontStyle: 'italic' }}
          >
            NEON<span className="text-white">RUNNER</span>
          </h1>
        </div>
      </div>

      {/* Center HUD - Level Progress */}
      <div className="flex flex-col items-center w-64">
        <div className="flex justify-between w-full text-xs font-bold uppercase tracking-widest text-cyan-400 mb-1">
          <span>
            {gameMode === 'waterfall' ? `Level ${currentLevel}` : 'Wave Progress'}
          </span>
          <span>Next: {100 - (score % 100)} pts</span>
        </div>
        <div className="w-full h-3 bg-gray-900 border border-gray-700 transform skew-x-12">
          <div
            className="h-full bg-gradient-to-r from-cyan-400 to-pink-500 transition-all duration-300"
            style={{ width: `${score % 100}%` }}
          ></div>
        </div>
      </div>

      {/* Stats */}
      <div className="flex items-center gap-12">
        <div className="flex flex-col items-end">
          <span className="text-[10px] uppercase tracking-widest text-cyan-400 font-bold drop-shadow-[0_0_5px_rgba(0,255,255,0.8)]">
            Score
          </span>
          <span className="font-mono text-3xl font-bold text-white drop-shadow-[2px_2px_0_#ff00ff]">
            {score.toLocaleString()}
          </span>
        </div>

        {/* Multiplier Badge */}
        <div className="relative w-24 h-16 flex items-center justify-center">
          <div
            className={`transition-all duration-200 transform ${
              multiplier > 1 ? 'scale-110' : 'scale-100'
            }`}
          >
            {multiplier > 1 ? (
              <div className="relative">
                <div className="absolute inset-0 bg-yellow-400 blur-lg animate-pulse opacity-50"></div>
                <div className="relative bg-gradient-to-b from-yellow-300 to-orange-500 px-4 py-1 rounded-lg border-2 border-white transform -rotate-6 shadow-[0_5px_0_#b45309]">
                  <span className="font-black italic text-2xl text-black">
                    x{multiplier}
                  </span>
                </div>
              </div>
            ) : (
              <div className="text-gray-600 font-mono text-xl opacity-50">x1</div>
            )}
          </div>
        </div>

        <div className="flex flex-col items-end">
          <span className="text-[10px] uppercase tracking-widest text-pink-400 font-bold drop-shadow-[0_0_5px_rgba(255,0,255,0.8)]">
            WPM
          </span>
          <span className="font-mono text-2xl font-bold text-white">{wpm}</span>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex gap-1">
          {[...Array(MAX_LIVES)].map((_, i) => (
            <div
              key={i}
              className={`w-3 h-8 transform skew-x-12 border border-black transition-all duration-100 ${
                i < lives
                  ? 'bg-gradient-to-t from-red-600 to-red-400 shadow-[0_0_10px_red]'
                  : 'bg-gray-900'
              }`}
            />
          ))}
        </div>
        <button
          onClick={onToggleMute}
          className="p-2 hover:bg-white/10 rounded-full text-cyan-400 hover:text-white transition"
        >
          {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
        </button>
      </div>
    </nav>
  );
}

