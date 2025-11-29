/**
 * TypeRunner - Guitar Hero style touch typing game
 * Main orchestrator component
 */

'use client';

import { useEffect } from 'react';
import { useTypeRunnerGame } from '@/lib/hooks/useTypeRunnerGame';
import { AudioEngine } from '@/lib/typerunner/audioEngine';
import HUD from './typerunner/HUD';
import GameCanvas from './typerunner/GameCanvas';
import MenuOverlay from './typerunner/MenuOverlay';
import GameOverOverlay from './typerunner/GameOverOverlay';
import PausedOverlay from './typerunner/PausedOverlay';

export default function TypeRunner() {
  const game = useTypeRunnerGame();

  // Global key tracking for visualization
  useEffect(() => {
    const handleDown = (e: KeyboardEvent) =>
      game.setActiveKey(e.key.toLowerCase());
    const handleUp = () => game.setActiveKey(null);
    window.addEventListener('keydown', handleDown);
    window.addEventListener('keyup', handleUp);
    return () => {
      window.removeEventListener('keydown', handleDown);
      window.removeEventListener('keyup', handleUp);
    };
  }, [game]);

  // Gameplay key handler
  useEffect(() => {
    window.addEventListener('keydown', game.handleKeyDown);
    return () => window.removeEventListener('keydown', game.handleKeyDown);
  }, [game.handleKeyDown]);

  // Life lost handler
  const handleLifeLost = () => {
    game.setLives((l) => {
      const nl = l - 1;
      if (nl <= 0) game.setGameState('gameover');
      return nl;
    });
    game.setStreak(0);
    game.streakRef.current = 0;
    if (!game.isMuted) AudioEngine.playError();
  };

  return (
    <div className="min-h-screen font-sans flex flex-col items-center overflow-hidden relative selection:bg-pink-500/50 selection:text-white bg-[#090014] text-white">
      {/* SCANLINES OVERLAY */}
      <div className="absolute inset-0 pointer-events-none z-50 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%] pointer-events-none"></div>

      {/* VIGNETTE */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_50%,#000000_100%)] z-10"></div>

      {/* TOP HUD */}
      <HUD
        score={game.score}
        currentLevel={game.currentLevel}
        multiplier={game.multiplier}
        wpm={game.wpm}
        lives={game.lives}
        isMuted={game.isMuted}
        gameMode={game.gameMode}
        onToggleMute={() => game.setIsMuted(!game.isMuted)}
        onOpenMenu={() => game.setGameState('paused')}
      />

      {/* CANVAS CONTAINER */}
      <div className="flex-1 w-full flex items-center justify-center relative p-4 z-0">
        <GameCanvas
          canvasRef={game.canvasRef}
          requestRef={game.requestRef}
          lastTimeRef={game.lastTimeRef}
          lastSpawnRef={game.lastSpawnRef}
          wordsRef={game.wordsRef}
          particlesRef={game.particlesRef}
          floatingTextsRef={game.floatingTextsRef}
          shakeRef={game.shakeRef}
          startTimeRef={game.startTimeRef}
          charCountRef={game.charCountRef}
          configRef={game.configRef}
          gameState={game.gameState}
          streak={game.streak}
          spawnWord={game.spawnWord}
          onLifeLost={handleLifeLost}
          onWpmUpdate={game.setWpm}
        />

        {/* --- MENU OVERLAY --- */}
        {game.gameState === 'menu' && (
          <MenuOverlay
            selectedLevel={game.selectedLevel}
            onSelectLevel={game.setSelectedLevel}
            onStartGame={game.startGame}
          />
        )}

        {/* --- GAME OVER --- */}
        {game.gameState === 'gameover' && (
          <GameOverOverlay
            score={game.score}
            streak={game.streak}
            currentLevel={game.currentLevel}
            gameMode={game.gameMode}
            onRetry={() => game.startGame(game.gameMode)}
            onBackToMenu={() => game.setGameState('menu')}
          />
        )}

        {/* --- PAUSED --- */}
        {game.gameState === 'paused' && (
          <PausedOverlay
            activeKey={game.activeKey}
            gameMode={game.gameMode}
            onResume={() => game.setGameState('playing')}
            onRestart={() => game.startGame(game.gameMode)}
            onQuit={() => game.setGameState('menu')}
          />
        )}
      </div>
    </div>
  );
}
