/**
 * Custom hook for TypeRunner game state management
 * Encapsulates all game logic, refs, and state
 */

import { useState, useRef, useCallback, useEffect } from 'react';
import {
  GameState,
  GameMode,
  Word,
  Particle,
  FloatingText,
  LevelConfig,
} from '../typerunner/types';
import { AudioEngine } from '../typerunner/audioEngine';
import { getLevelConfig } from '../typerunner/levelConfig';
import { MAX_LIVES, LANE_WIDTH } from '../typerunner/constants';

export function useTypeRunnerGame() {
  // --- STATE ---
  const [gameState, setGameState] = useState<GameState>('menu');
  const [gameMode, setGameMode] = useState<GameMode>('waterfall');
  const [selectedLevel, setSelectedLevel] = useState(0);
  const [currentLevel, setCurrentLevel] = useState(0);

  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [multiplier, setMultiplier] = useState(1);
  const [lives, setLives] = useState(MAX_LIVES);
  const [wpm, setWpm] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [activeKey, setActiveKey] = useState<string | null>(null);

  // --- REFS ---
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number | null>(null);
  const lastTimeRef = useRef(0);
  const lastSpawnRef = useRef(0);
  const wordsRef = useRef<Word[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const floatingTextsRef = useRef<FloatingText[]>([]);
  const shakeRef = useRef(0);
  const streakRef = useRef(0);
  const scoreRef = useRef(0);
  const startTimeRef = useRef(0);
  const charCountRef = useRef(0);
  const configRef = useRef<LevelConfig>(getLevelConfig(0));

  // --- GAME HELPERS ---
  const spawnWord = useCallback((canvasWidth: number) => {
    const pool = configRef.current.pool;
    const text = pool[Math.floor(Math.random() * pool.length)];
    const id = Date.now() + Math.random();

    const colCount = 5;
    const colWidth = LANE_WIDTH / colCount;
    const col = Math.floor(Math.random() * colCount);
    const laneStart = (canvasWidth - LANE_WIDTH) / 2;
    const x = laneStart + col * colWidth + colWidth / 2;

    wordsRef.current.push({
      id,
      text,
      x,
      y: -50,
      typedIndex: 0,
      completed: false,
      missed: false,
      color: `hsl(${id % 360}, 100%, 60%)`,
    });
  }, []);

  const createParticles = useCallback(
    (x: number, y: number, color: string, count = 8) => {
      for (let i = 0; i < count; i++) {
        particlesRef.current.push({
          x,
          y,
          vx: (Math.random() - 0.5) * 15,
          vy: (Math.random() - 0.5) * 15,
          life: 1.0,
          color,
        });
      }
    },
    []
  );

  const createFloatingText = useCallback(
    (x: number, y: number, text: string, color: string, size = 28) => {
      floatingTextsRef.current.push({
        x,
        y,
        text,
        color,
        size,
        life: 1.0,
        vy: -2,
      });
    },
    []
  );

  // --- KEY HANDLERS ---
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (gameState !== 'playing') return;
      if (e.ctrlKey || e.altKey || e.metaKey) return;
      if (e.key.length !== 1) return;

      const activeWords = wordsRef.current.filter(
        (w) => !w.missed && !w.completed
      );
      activeWords.sort((a, b) => b.y - a.y);
      const target = activeWords[0];

      if (target) {
        if (e.key === target.text[target.typedIndex]) {
          target.typedIndex++;
          charCountRef.current++;
          if (!isMuted) AudioEngine.playHit();

          createParticles(target.x, target.y, '#00ffff', 2);

          if (target.typedIndex >= target.text.length) {
            target.completed = true;
            createParticles(target.x, target.y, '#ff00ff', 15);
            createParticles(target.x, target.y, '#ffffff', 5);

            const points = 10 * multiplier;

            const oldScore = scoreRef.current;
            const newScore = oldScore + points;
            scoreRef.current = newScore;
            setScore(newScore);

            createFloatingText(target.x, target.y - 20, `+${points}`, '#ffff00');

            // Progression check (every 100 points)
            const oldLevelBlock = Math.floor(oldScore / 100);
            const newLevelBlock = Math.floor(newScore / 100);

            if (newLevelBlock > oldLevelBlock) {
              if (!isMuted) AudioEngine.playLevelUp();
              AudioEngine.resetNotes();

              const splashText =
                gameMode === 'waterfall' ? 'LEVEL UP!' : 'WAVE CLEAR!';
              createFloatingText(
                canvasRef.current!.width / 2,
                canvasRef.current!.height / 2,
                splashText,
                '#00ffff',
                60
              );

              if (gameMode === 'waterfall' && currentLevel < 50) {
                const levelsToGain = newLevelBlock - oldLevelBlock;
                const newLvl = Math.min(50, currentLevel + levelsToGain);
                setCurrentLevel(newLvl);
                configRef.current = getLevelConfig(newLvl);
              }
            }

            setStreak((s) => {
              const ns = s + 1;
              streakRef.current = ns;

              if (ns >= 30) setMultiplier(4);
              else if (ns >= 20) setMultiplier(3);
              else if (ns >= 10) setMultiplier(2);
              else setMultiplier(1);

              return ns;
            });
          }
        } else {
          setStreak(0);
          streakRef.current = 0;
          setMultiplier(1);
          shakeRef.current = 20;
          if (!isMuted) AudioEngine.playError();
        }
      }
    },
    [
      gameState,
      currentLevel,
      multiplier,
      isMuted,
      gameMode,
      createParticles,
      createFloatingText,
    ]
  );

  // --- GAME START ---
  const startGame = useCallback(
    (mode: GameMode = 'waterfall') => {
      setGameState('playing');
      setGameMode(mode);
      setScore(0);
      setLives(MAX_LIVES);
      setStreak(0);
      setMultiplier(1);
      setWpm(0);

      const startLvl = mode === 'waterfall' ? 0 : selectedLevel;
      setCurrentLevel(startLvl);

      configRef.current = getLevelConfig(startLvl);

      wordsRef.current = [];
      particlesRef.current = [];
      floatingTextsRef.current = [];
      streakRef.current = 0;
      scoreRef.current = 0;
      startTimeRef.current = Date.now();
      charCountRef.current = 0;
      AudioEngine.init();
    },
    [selectedLevel]
  );

  return {
    // State
    gameState,
    setGameState,
    gameMode,
    selectedLevel,
    setSelectedLevel,
    currentLevel,
    setCurrentLevel,
    score,
    streak,
    setStreak,
    multiplier,
    setMultiplier,
    lives,
    wpm,
    isMuted,
    setIsMuted,
    activeKey,
    setActiveKey,

    // Refs
    canvasRef,
    requestRef,
    lastTimeRef,
    lastSpawnRef,
    wordsRef,
    particlesRef,
    floatingTextsRef,
    shakeRef,
    streakRef,
    scoreRef,
    startTimeRef,
    charCountRef,
    configRef,

    // Methods
    startGame,
    handleKeyDown,
    spawnWord,
    createParticles,
    createFloatingText,
    setLives,
    setWpm,
  };
}

