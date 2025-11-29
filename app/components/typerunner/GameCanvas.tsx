/**
 * Game canvas with rendering and animation loop
 */

'use client';

import { useEffect, MutableRefObject } from 'react';
import { Word, Particle, FloatingText, LevelConfig } from '@/lib/typerunner/types';
import {
  LANE_WIDTH,
  CRITICAL_LINE_Y_PCT,
  THEME,
} from '@/lib/typerunner/constants';

interface GameCanvasProps {
  canvasRef: MutableRefObject<HTMLCanvasElement | null>;
  requestRef: MutableRefObject<number | null>;
  lastTimeRef: MutableRefObject<number>;
  lastSpawnRef: MutableRefObject<number>;
  wordsRef: MutableRefObject<Word[]>;
  particlesRef: MutableRefObject<Particle[]>;
  floatingTextsRef: MutableRefObject<FloatingText[]>;
  shakeRef: MutableRefObject<number>;
  startTimeRef: MutableRefObject<number>;
  charCountRef: MutableRefObject<number>;
  configRef: MutableRefObject<LevelConfig>;
  gameState: string;
  streak: number;
  spawnWord: (canvasWidth: number) => void;
  onLifeLost: () => void;
  onWpmUpdate: (wpm: number) => void;
}

export default function GameCanvas({
  canvasRef,
  requestRef,
  lastTimeRef,
  lastSpawnRef,
  wordsRef,
  particlesRef,
  floatingTextsRef,
  shakeRef,
  startTimeRef,
  charCountRef,
  configRef,
  gameState,
  streak,
  spawnWord,
  onLifeLost,
  onWpmUpdate,
}: GameCanvasProps) {
  // Animation loop
  useEffect(() => {
    if (gameState !== 'playing') return;

    const animate = (time: number) => {
      if (gameState !== 'playing') return;

      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const deltaTime = time - lastTimeRef.current;
      lastTimeRef.current = time;

      // Shake effect
      let shakeX = 0,
        shakeY = 0;
      if (shakeRef.current > 0) {
        shakeX = (Math.random() - 0.5) * shakeRef.current;
        shakeY = (Math.random() - 0.5) * shakeRef.current;
        shakeRef.current *= 0.9;
        if (shakeRef.current < 0.5) shakeRef.current = 0;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();
      ctx.translate(shakeX, shakeY);

      // --- RETRO GRID BACKGROUND ---
      const laneX = (canvas.width - LANE_WIDTH) / 2;

      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, THEME.laneBg);
      gradient.addColorStop(1, '#2a0036');
      ctx.fillStyle = gradient;
      ctx.fillRect(laneX, 0, LANE_WIDTH, canvas.height);

      ctx.strokeStyle = THEME.grid;
      ctx.lineWidth = 2;
      const gridSize = 80;
      const gridOffset = ((time * 0.1 * configRef.current.speed) % gridSize);

      // Vertical Lines
      ctx.beginPath();
      for (let i = 0; i <= 5; i++) {
        const lx = laneX + i * (LANE_WIDTH / 5);
        ctx.moveTo(lx, 0);
        ctx.lineTo(lx, canvas.height);
      }
      ctx.stroke();

      // Horizontal Lines
      ctx.beginPath();
      for (let y = -gridSize + gridOffset; y < canvas.height; y += gridSize) {
        ctx.moveTo(laneX, y);
        ctx.lineTo(laneX + LANE_WIDTH, y);
      }
      ctx.stroke();

      const criticalY = canvas.height * CRITICAL_LINE_Y_PCT;
      const pulse = Math.sin(time / 200) * 0.5 + 0.5;

      ctx.shadowBlur = 20 + 10 * pulse;
      ctx.shadowColor = THEME.primary;
      ctx.fillStyle = THEME.primary;
      ctx.fillRect(laneX - 20, criticalY, LANE_WIDTH + 40, 4);
      ctx.shadowBlur = 0;

      // --- GAME LOGIC ---
      if (time - lastSpawnRef.current > configRef.current.spawnRate) {
        spawnWord(canvas.width);
        lastSpawnRef.current = time;
      }

      const speedPx = configRef.current.speed * (deltaTime / 16);

      wordsRef.current.forEach((word) => {
        word.y += speedPx;

        if (word.y > canvas.height && !word.completed && !word.missed) {
          word.missed = true;
          onLifeLost();
          shakeRef.current = 20;
        }
      });

      wordsRef.current = wordsRef.current.filter(
        (w) => w.y < canvas.height + 100 && !w.completed
      );

      // Draw Words
      ctx.font = 'bold 24px "Courier New", monospace';
      ctx.textAlign = 'center';

      const activeWords = wordsRef.current.filter((w) => !w.missed && !w.completed);
      activeWords.sort((a, b) => b.y - a.y);
      const targetWord = activeWords[0];

      wordsRef.current.forEach((word) => {
        if (word.missed) return;
        const isTarget = targetWord && word.id === targetWord.id;
        const fullWidth = ctx.measureText(word.text).width;

        const padding = 14;
        const rh = 48;
        const rx = word.x - fullWidth / 2 - padding;
        const ry = word.y - rh / 2 - 6;
        const rw = fullWidth + padding * 2;

        if (isTarget) {
          ctx.shadowBlur = 15;
          ctx.shadowColor = THEME.secondary;
          ctx.strokeStyle = THEME.secondary;
          ctx.fillStyle = 'rgba(0, 255, 255, 0.1)';
          ctx.lineWidth = 2;
        } else {
          ctx.shadowBlur = 0;
          ctx.strokeStyle = 'rgba(255,255,255,0.1)';
          ctx.fillStyle = 'rgba(0,0,0,0.5)';
          ctx.lineWidth = 1;
        }

        ctx.beginPath();
        ctx.rect(rx, ry, rw, rh);
        ctx.fill();
        ctx.stroke();
        ctx.shadowBlur = 0;

        const typedPart = word.text.substring(0, word.typedIndex);
        const untypedPart = word.text.substring(word.typedIndex);
        const startX = word.x - fullWidth / 2;

        ctx.textAlign = 'left';

        ctx.font = 'bold 24px "Courier New", monospace';
        ctx.fillStyle = isTarget ? THEME.primary : THEME.text;
        if (isTarget) {
          ctx.shadowBlur = 10;
          ctx.shadowColor = THEME.primary;
        }
        ctx.fillText(typedPart, startX, word.y);
        ctx.shadowBlur = 0;

        const typedWidth = ctx.measureText(typedPart).width;
        ctx.fillStyle = isTarget ? '#ffffff' : THEME.textDim;
        ctx.fillText(untypedPart, startX + typedWidth, word.y);

        if (isTarget && untypedPart.length > 0) {
          ctx.fillStyle = THEME.tertiary;
          const cursorWidth = ctx.measureText(untypedPart[0]).width;
          ctx.fillRect(startX + typedWidth, word.y + 6, cursorWidth, 3);
        }
      });

      // Particles
      particlesRef.current.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 0.03;
        p.vy += 0.3;

        ctx.globalAlpha = Math.max(0, p.life);
        ctx.fillStyle = p.color;

        ctx.beginPath();
        const size = Math.max(0, 4 * p.life);
        ctx.rect(p.x, p.y, size, size);
        ctx.fill();
        ctx.globalAlpha = 1.0;
      });
      particlesRef.current = particlesRef.current.filter((p) => p.life > 0);

      // Floating texts
      floatingTextsRef.current.forEach((ft) => {
        ft.y += ft.vy;
        ft.life -= 0.02;

        ctx.save();
        ctx.globalAlpha = Math.max(0, ft.life);
        ctx.fillStyle = ft.color;
        ctx.shadowColor = ft.color;
        ctx.shadowBlur = 10;
        ctx.font = `bold italic ${ft.size}px 'Verdana', sans-serif`;
        ctx.textAlign = 'center';
        ctx.fillText(ft.text, ft.x, ft.y);
        ctx.restore();
      });
      floatingTextsRef.current = floatingTextsRef.current.filter(
        (ft) => ft.life > 0
      );

      ctx.restore();

      // WPM calculation
      if (Math.floor(time / 1000) > Math.floor(lastTimeRef.current / 1000)) {
        const mins = (Date.now() - startTimeRef.current) / 60000;
        if (mins > 0) onWpmUpdate(Math.round(charCountRef.current / 5 / mins));
      }

      requestRef.current = requestAnimationFrame(animate);
    };

    lastTimeRef.current = performance.now();
    requestRef.current = requestAnimationFrame(animate);

    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [
    gameState,
    canvasRef,
    requestRef,
    lastTimeRef,
    lastSpawnRef,
    wordsRef,
    particlesRef,
    floatingTextsRef,
    shakeRef,
    startTimeRef,
    charCountRef,
    configRef,
    spawnWord,
    onLifeLost,
    onWpmUpdate,
    streak,
  ]);

  // Canvas sizing
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = window.innerWidth > 1000 ? 1000 : window.innerWidth;
      canvas.height = window.innerHeight * 0.85;
    }
  }, [canvasRef]);

  return (
    <canvas
      ref={canvasRef}
      className="rounded-lg shadow-2xl border-x-4 border-pink-600/30 bg-[#090014]"
      style={{
        maxHeight: '100%',
        boxShadow: `0 0 40px rgba(255, 0, 255, ${streak > 10 ? 0.3 : 0.1})`,
      }}
    />
  );
}

