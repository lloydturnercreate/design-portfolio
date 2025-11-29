/**
 * Game over overlay with final stats
 */

import { GameMode } from '@/lib/typerunner/types';

interface GameOverOverlayProps {
  score: number;
  streak: number;
  currentLevel: number;
  gameMode: GameMode;
  onRetry: () => void;
  onBackToMenu: () => void;
}

export default function GameOverOverlay({
  score,
  streak,
  currentLevel,
  gameMode,
  onRetry,
  onBackToMenu,
}: GameOverOverlayProps) {
  return (
    <div className="absolute inset-0 z-30 flex items-center justify-center backdrop-blur-md bg-red-900/30">
      <div className="bg-black border-4 border-red-600 w-full max-w-md p-10 text-center animate-in zoom-in duration-300 shadow-[0_0_100px_red]">
        <h2 className="text-5xl font-black text-red-500 mb-2 tracking-tighter">
          GAME OVER
        </h2>
        <p className="text-red-300 font-mono text-sm mb-8 animate-pulse">
          SYSTEM FAILURE // TRY AGAIN
        </p>

        <div className="bg-gray-900 p-6 mb-8 border border-gray-700">
          <div className="flex justify-between items-center border-b border-gray-800 pb-2 mb-2">
            <span className="text-gray-500 uppercase text-xs">Final Score</span>
            <span className="text-2xl font-mono text-white">
              {score.toLocaleString()}
            </span>
          </div>
          {gameMode === 'waterfall' && (
            <div className="flex justify-between items-center border-b border-gray-800 pb-2 mb-2">
              <span className="text-gray-500 uppercase text-xs">Level Reached</span>
              <span className="text-2xl font-mono text-cyan-400">{currentLevel}</span>
            </div>
          )}
          <div className="flex justify-between items-center">
            <span className="text-gray-500 uppercase text-xs">High Streak</span>
            <span className="text-2xl font-mono text-yellow-500">{streak}</span>
          </div>
        </div>

        <div className="space-y-4">
          <button
            onClick={onRetry}
            className="w-full bg-white text-black font-black py-4 uppercase tracking-widest hover:bg-cyan-400 transition-colors"
          >
            Retry {gameMode}
          </button>
          <button
            onClick={onBackToMenu}
            className="w-full bg-transparent border-2 border-white text-white font-bold py-3 uppercase hover:bg-white hover:text-black transition-colors"
          >
            Menu
          </button>
        </div>
      </div>
    </div>
  );
}

