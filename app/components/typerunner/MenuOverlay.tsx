/**
 * Main menu overlay with game mode selection
 */

import { FastForward, Target } from 'lucide-react';
import { GameMode } from '@/lib/typerunner/types';
import { getLevelConfig } from '@/lib/typerunner/levelConfig';

interface MenuOverlayProps {
  selectedLevel: number;
  onSelectLevel: (level: number) => void;
  onStartGame: (mode: GameMode) => void;
}

export default function MenuOverlay({
  selectedLevel,
  onSelectLevel,
  onStartGame,
}: MenuOverlayProps) {
  const selectedConfig = getLevelConfig(selectedLevel);

  return (
    <div className="absolute inset-0 z-30 flex items-center justify-center p-4 backdrop-blur-md bg-black/60">
      <div className="bg-[#1a0b2e] border-2 border-cyan-500 w-full max-w-3xl p-10 shadow-[0_0_50px_rgba(0,255,255,0.2)] relative overflow-hidden flex flex-col items-center animate-in zoom-in duration-300">
        {/* Decorative Corner Triangles */}
        <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-pink-500"></div>
        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-pink-500"></div>

        <div className="text-center mb-8 relative">
          <h2 className="text-5xl font-black italic text-white mb-2 drop-shadow-[4px_4px_0_#ff00ff]">
            NEON RUNNER
          </h2>
          <div className="h-1 w-32 bg-cyan-500 mx-auto mt-4 shadow-[0_0_10px_#00ffff]"></div>
        </div>

        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* WATERFALL MODE */}
          <div className="group relative">
            <div className="absolute inset-0 bg-pink-600 blur-xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
            <div
              className="relative bg-black/40 border-2 border-pink-500 p-6 h-full flex flex-col justify-between hover:bg-pink-900/20 transition-colors cursor-pointer"
              onClick={() => onStartGame('waterfall')}
            >
              <div>
                <h3 className="text-2xl font-black italic text-white mb-2 flex items-center gap-2">
                  <FastForward className="text-pink-500" /> WATERFALL
                </h3>
                <p className="text-gray-300 text-sm font-mono mb-4">
                  The main event. Infinite progression. Difficulty spikes every 100
                  points.
                </p>
                <ul className="text-xs text-pink-300 space-y-1 font-mono">
                  <li>• Starts: Level 0</li>
                  <li>• Scaling: +1 Level / 100 Score</li>
                  <li>• Objective: Survive</li>
                </ul>
              </div>
              <button className="w-full mt-4 bg-pink-600 hover:bg-pink-500 text-white font-bold py-3 uppercase tracking-widest shadow-[4px_4px_0_#9d174d] active:shadow-none active:translate-x-1 active:translate-y-1 transition-all">
                INITIATE RUN
              </button>
            </div>
          </div>

          {/* TRAINING MODE */}
          <div className="group relative">
            <div className="relative bg-black/40 border-2 border-cyan-500 p-6 h-full flex flex-col justify-between hover:bg-cyan-900/20 transition-colors">
              <div>
                <h3 className="text-2xl font-black italic text-white mb-2 flex items-center gap-2">
                  <Target className="text-cyan-500" /> TRAINING
                </h3>
                <p className="text-gray-300 text-sm font-mono mb-4">
                  Configure a specific difficulty loop. Good for practicing specific
                  sets.
                </p>

                {/* Difficulty Slider */}
                <div className="mb-2 bg-black/40 p-3 border border-white/10">
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-xs uppercase font-bold text-yellow-400">
                      Difficulty
                    </span>
                    <span className="text-xl font-mono text-white">
                      {selectedLevel}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="50"
                    value={selectedLevel}
                    onChange={(e) => onSelectLevel(parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-900 rounded-none appearance-none cursor-pointer border border-gray-700"
                    style={{
                      background: `linear-gradient(90deg, #00ffff ${
                        selectedLevel * 2
                      }%, #333 ${selectedLevel * 2}%)`,
                    }}
                  />
                  <div className="text-[10px] text-cyan-300 font-mono mt-2 text-right">
                    {selectedConfig.description}
                  </div>
                </div>
              </div>
              <button
                onClick={() => onStartGame('training')}
                className="w-full mt-4 bg-cyan-700 hover:bg-cyan-600 text-white font-bold py-3 uppercase tracking-widest shadow-[4px_4px_0_#155e75] active:shadow-none active:translate-x-1 active:translate-y-1 transition-all"
              >
                START LOOP
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

