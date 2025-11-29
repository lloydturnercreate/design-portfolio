/**
 * TypeRunner - Guitar Hero Style Touch Typing Game
 * Self-contained interactive experience
 */

'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { Play, Pause, RotateCcw, Volume2, VolumeX, Keyboard, Menu, LogOut, FastForward, Target, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { AudioEngine } from '@/lib/typerunner/audioEngine';
import { getLevelConfig } from '@/lib/typerunner/levelConfig';
import { KEYBOARD_ROWS, FINGER_COLORS, MAX_LIVES, LANE_WIDTH, CRITICAL_LINE_Y_PCT, THEME } from '@/lib/typerunner/constants';
import type { GameState, GameMode, Word, Particle, FloatingText } from '@/lib/typerunner/types';
import AIProjectPageWrapper from '@/app/components/transitions/AIProjectPageWrapper';

function TypeRunnerGame() {
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
  const [isMobile, setIsMobile] = useState(false);

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
  const configRef = useRef(getLevelConfig(0));

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

  const createParticles = useCallback((x: number, y: number, color: string, count = 8) => {
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
  }, []);

  const createFloatingText = useCallback((x: number, y: number, text: string, color: string, size = 28) => {
    floatingTextsRef.current.push({ x, y, text, color, size, life: 1.0, vy: -2 });
  }, []);

  // --- KEY HANDLERS ---
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (gameState !== 'playing') return;
      if (e.ctrlKey || e.altKey || e.metaKey) return;
      if (e.key.length !== 1) return;

      const activeWords = wordsRef.current.filter((w) => !w.missed && !w.completed);
      activeWords.sort((a, b) => b.y - a.y);
      const target = activeWords[0];

      if (target) {
        if (e.key === target.text[target.typedIndex]) {
          target.typedIndex++;
          charCountRef.current++;
          if (!isMuted) AudioEngine.playHit();
          createParticles(target.x, target.y, THEME.secondary, 2);

          if (target.typedIndex >= target.text.length) {
            target.completed = true;
            createParticles(target.x, target.y, THEME.primary, 15);
            createParticles(target.x, target.y, '#ffffff', 5);

            const points = 10 * multiplier;
            const oldScore = scoreRef.current;
            const newScore = oldScore + points;
            scoreRef.current = newScore;
            setScore(newScore);

            createFloatingText(target.x, target.y - 20, `+${points}`, THEME.tertiary);

            const oldLevelBlock = Math.floor(oldScore / 100);
            const newLevelBlock = Math.floor(newScore / 100);

            if (newLevelBlock > oldLevelBlock) {
              if (!isMuted) AudioEngine.playLevelUp();
              AudioEngine.resetNotes();

              const splashText = gameMode === 'waterfall' ? 'LEVEL UP!' : 'WAVE CLEAR!';
              createFloatingText(canvasRef.current!.width / 2, canvasRef.current!.height / 2, splashText, THEME.secondary, 60);

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
    [gameState, currentLevel, multiplier, isMuted, gameMode, createParticles, createFloatingText]
  );

  // --- ANIMATION LOOP ---
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

      let shakeX = 0, shakeY = 0;
      if (shakeRef.current > 0) {
        shakeX = (Math.random() - 0.5) * shakeRef.current;
        shakeY = (Math.random() - 0.5) * shakeRef.current;
        shakeRef.current *= 0.9;
        if (shakeRef.current < 0.5) shakeRef.current = 0;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();
      ctx.translate(shakeX, shakeY);

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

      ctx.beginPath();
      for (let i = 0; i <= 5; i++) {
        const lx = laneX + i * (LANE_WIDTH / 5);
        ctx.moveTo(lx, 0);
        ctx.lineTo(lx, canvas.height);
      }
      ctx.stroke();

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

      if (time - lastSpawnRef.current > configRef.current.spawnRate) {
        spawnWord(canvas.width);
        lastSpawnRef.current = time;
      }

      const speedPx = configRef.current.speed * (deltaTime / 16);

      wordsRef.current.forEach((word) => {
        word.y += speedPx;
        if (word.y > canvas.height && !word.completed && !word.missed) {
          word.missed = true;
          setLives((l) => {
            const nl = l - 1;
            if (nl <= 0) setGameState('gameover');
            return nl;
          });
          setStreak(0);
          streakRef.current = 0;
          setMultiplier(1);
          shakeRef.current = 20;
          if (!isMuted) AudioEngine.playError();
        }
      });

      wordsRef.current = wordsRef.current.filter((w) => w.y < canvas.height + 100 && !w.completed);

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
      floatingTextsRef.current = floatingTextsRef.current.filter((ft) => ft.life > 0);

      ctx.restore();

      if (Math.floor(time / 1000) > Math.floor(lastTimeRef.current / 1000)) {
        const mins = (Date.now() - startTimeRef.current) / 60000;
        if (mins > 0) setWpm(Math.round(charCountRef.current / 5 / mins));
      }

      requestRef.current = requestAnimationFrame(animate);
    };

    lastTimeRef.current = performance.now();
    requestRef.current = requestAnimationFrame(animate);

    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [gameState, spawnWord, isMuted]);

  // --- LIFECYCLE ---
  useEffect(() => {
    const handleDown = (e: KeyboardEvent) => setActiveKey(e.key.toLowerCase());
    const handleUp = () => setActiveKey(null);
    window.addEventListener('keydown', handleDown);
    window.addEventListener('keyup', handleUp);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleDown);
      window.removeEventListener('keyup', handleUp);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  useEffect(() => {
    const c = canvasRef.current;
    if (c) {
      // Account for padding and max width of container
      const maxWidth = Math.min(window.innerWidth - 64, 1400); // 64px total padding (32px each side)
      c.width = maxWidth;
      c.height = Math.min(window.innerHeight - 280, 800); // Account for header and HUD
    }
  }, []);

  // Detect mobile/tablet devices
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024); // lg breakpoint
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const startGame = (mode: GameMode = 'waterfall') => {
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
  };

  const selectedConfig = getLevelConfig(selectedLevel);

  return (
    <div className="min-h-screen font-sans overflow-hidden relative selection:bg-pink-500/50 selection:text-white bg-[#090014] text-white">
      {/* SCANLINES OVERLAY */}
      <div className="absolute inset-0 pointer-events-none z-50 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%]"></div>
      
      {/* VIGNETTE */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_50%,#000000_100%)] z-10"></div>

      {/* FRAMED CONTENT CONTAINER */}
      <div className="relative z-20 min-h-screen p-8 flex flex-col">
        {/* HEADER - Back Button & Title (Desktop Only) */}
        {!isMobile && (
          <div className="mb-6 flex items-center justify-between max-w-7xl mx-auto w-full">
            <Link 
              href="/#experiments"
              className="group flex items-center gap-3 text-cyan-400 hover:text-cyan-300 transition-all duration-300 bg-black/40 backdrop-blur-sm px-6 py-3 border border-cyan-500/30 hover:border-cyan-400 rounded-lg hover:shadow-[0_0_20px_rgba(0,255,255,0.3)]"
            >
              <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
              <span className="font-bold uppercase tracking-wider text-sm">Back</span>
            </Link>
            
            <div className="text-right">
              <h1 className="font-black text-4xl tracking-tighter text-white drop-shadow-[4px_4px_0_#ff00ff]" style={{ fontFamily: 'Verdana, sans-serif', fontStyle: 'italic' }}>
                TYPE RUNNER
              </h1>
              <p className="text-sm text-gray-400 font-mono mt-1">Touch Typing // Arcade Style</p>
            </div>
          </div>
        )}

        {/* MOBILE MESSAGE */}
        {isMobile ? (
          <div className="flex-1 max-w-4xl mx-auto w-full flex items-center justify-center p-6">
            <div className="bg-black/80 backdrop-blur-md border-2 border-cyan-500 rounded-xl shadow-[0_0_50px_rgba(0,255,255,0.3)] p-8 md:p-12 text-center relative overflow-hidden">
              {/* Corner decorations */}
              <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-pink-500"></div>
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-pink-500"></div>

              {/* Logo */}
              <div className="mb-8">
                <h2 className="text-5xl md:text-6xl font-black italic text-white mb-2 drop-shadow-[4px_4px_0_#ff00ff]" style={{ fontFamily: 'Verdana, sans-serif' }}>
                  TYPE RUNNER
                </h2>
                <div className="h-1 w-32 bg-cyan-500 mx-auto mt-4 shadow-[0_0_10px_#00ffff]"></div>
              </div>

              {/* Message */}
              <div className="mb-8 space-y-4">
                <div className="flex items-center justify-center gap-3 mb-6">
                  <Keyboard size={32} className="text-pink-500" />
                </div>
                <p className="text-xl md:text-2xl text-white font-bold mb-4">
                  Desktop Required
                </p>
                <p className="text-base text-gray-300 font-mono max-w-md mx-auto leading-relaxed">
                  TYPE RUNNER is a keyboard-based typing game designed for desktop computers with physical keyboards.
                </p>
                <p className="text-sm text-cyan-400 font-mono">
                  Please visit on a desktop device to play!
                </p>
              </div>

              {/* Navigation */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link 
                  href="/#experiments"
                  className="w-full sm:w-auto bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-4 px-8 uppercase tracking-widest shadow-[4px_4px_0_#155e75] hover:shadow-[2px_2px_0_#155e75] active:shadow-none active:translate-x-1 active:translate-y-1 transition-all"
                >
                  View Other Projects
                </Link>
                <Link 
                  href="/#experiments"
                  className="w-full sm:w-auto bg-transparent border-2 border-white/30 hover:border-white text-white font-bold py-4 px-8 uppercase tracking-wider transition-all hover:bg-white/10"
                >
                  Back
                </Link>
              </div>
            </div>
          </div>
        ) : (
          /* GAME FRAME */
          <div className="flex-1 max-w-7xl mx-auto w-full bg-black/60 backdrop-blur-md border-2 border-pink-500/40 rounded-xl shadow-[0_0_50px_rgba(255,0,255,0.2)] overflow-hidden flex flex-col">


          {/* TOP HUD */}
          <nav className="w-full flex items-center justify-between p-4 border-b-2 border-pink-500 bg-black/40 backdrop-blur-sm relative">
            <div className="flex items-center gap-4">
              <button onClick={() => setGameState('paused')} className="bg-purple-900 hover:bg-purple-800 p-2 rounded border border-purple-500 text-white transition-colors" title="Open Menu">
                <Menu size={24} />
              </button>
              <div className="bg-pink-600 p-2 rounded transform -skew-x-12 border-2 border-white shadow-[0_0_15px_#ff00ff]">
                <Keyboard size={24} className="text-white transform skew-x-12" />
              </div>
            </div>

            <div className="flex flex-col items-center w-64">
              <div className="flex justify-between w-full text-xs font-bold uppercase tracking-widest text-cyan-400 mb-1">
                <span>{gameMode === 'waterfall' ? `Level ${currentLevel}` : 'Wave Progress'}</span>
                <span>Next: {100 - (score % 100)} pts</span>
              </div>
              <div className="w-full h-3 bg-gray-900 border border-gray-700 transform skew-x-12">
                <div className="h-full bg-gradient-to-r from-cyan-400 to-pink-500 transition-all duration-300" style={{ width: `${score % 100}%` }}></div>
              </div>
            </div>

            <div className="flex items-center gap-12">
              <div className="flex flex-col items-end">
                <span className="text-[10px] uppercase tracking-widest text-cyan-400 font-bold drop-shadow-[0_0_5px_rgba(0,255,255,0.8)]">Score</span>
                <span className="font-mono text-3xl font-bold text-white drop-shadow-[2px_2px_0_#ff00ff]">{score.toLocaleString()}</span>
              </div>

              <div className="relative w-24 h-16 flex items-center justify-center">
                <div className={`transition-all duration-200 transform ${multiplier > 1 ? 'scale-110' : 'scale-100'}`}>
                  {multiplier > 1 ? (
                    <div className="relative">
                      <div className="absolute inset-0 bg-yellow-400 blur-lg animate-pulse opacity-50"></div>
                      <div className="relative bg-gradient-to-b from-yellow-300 to-orange-500 px-4 py-1 rounded-lg border-2 border-white transform -rotate-6 shadow-[0_5px_0_#b45309]">
                        <span className="font-black italic text-2xl text-black">x{multiplier}</span>
                      </div>
                    </div>
                  ) : (
                    <div className="text-gray-600 font-mono text-xl opacity-50">x1</div>
                  )}
                </div>
              </div>

              <div className="flex flex-col items-end">
                <span className="text-[10px] uppercase tracking-widest text-pink-400 font-bold drop-shadow-[0_0_5px_rgba(255,0,255,0.8)]">WPM</span>
                <span className="font-mono text-2xl font-bold text-white">{wpm}</span>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="flex gap-1">
                {[...Array(MAX_LIVES)].map((_, i) => (
                  <div key={i} className={`w-3 h-8 transform skew-x-12 border border-black transition-all duration-100 ${i < lives ? 'bg-gradient-to-t from-red-600 to-red-400 shadow-[0_0_10px_red]' : 'bg-gray-900'}`} />
                ))}
              </div>
              <button onClick={() => setIsMuted(!isMuted)} className="p-2 hover:bg-white/10 rounded-full text-cyan-400 hover:text-white transition">
                {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
              </button>
            </div>
          </nav>

          {/* CANVAS CONTAINER */}
          <div className="flex-1 w-full flex items-center justify-center relative p-6">
            <canvas ref={canvasRef} className="rounded-lg shadow-2xl border-x-4 border-pink-600/30 bg-[#090014]" style={{ maxHeight: '100%', boxShadow: `0 0 40px rgba(255, 0, 255, ${streak > 10 ? 0.3 : 0.1})` }} />

            {/* MENU OVERLAY */}
            {gameState === 'menu' && (
              <div className="absolute inset-0 z-30 flex items-center justify-center p-4 backdrop-blur-md bg-black/60">
                <div className="bg-[#1a0b2e] border-2 border-cyan-500 w-full max-w-3xl p-10 shadow-[0_0_50px_rgba(0,255,255,0.2)] relative overflow-hidden flex flex-col items-center">
                  <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-pink-500"></div>
                  <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-pink-500"></div>
                  
                  <div className="text-center mb-8 relative">
                    <h2 className="text-5xl font-black italic text-white mb-2 drop-shadow-[4px_4px_0_#ff00ff]">TYPE RUNNER</h2>
                    <div className="h-1 w-32 bg-cyan-500 mx-auto mt-4 shadow-[0_0_10px_#00ffff]"></div>
                  </div>

                  <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                    <div className="group relative">
                      <div className="absolute inset-0 bg-pink-600 blur-xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
                      <div className="relative bg-black/40 border-2 border-pink-500 p-6 h-full flex flex-col justify-between hover:bg-pink-900/20 transition-colors cursor-pointer" onClick={() => startGame('waterfall')}>
                        <div>
                          <h3 className="text-2xl font-black italic text-white mb-2 flex items-center gap-2">
                            <FastForward className="text-pink-500" /> WATERFALL
                          </h3>
                          <p className="text-gray-300 text-sm font-mono mb-4">The main event. Infinite progression. Difficulty spikes every 100 points.</p>
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

                    <div className="group relative">
                      <div className="relative bg-black/40 border-2 border-cyan-500 p-6 h-full flex flex-col justify-between hover:bg-cyan-900/20 transition-colors">
                        <div>
                          <h3 className="text-2xl font-black italic text-white mb-2 flex items-center gap-2">
                            <Target className="text-cyan-500" /> TRAINING
                          </h3>
                          <p className="text-gray-300 text-sm font-mono mb-4">Configure a specific difficulty loop. Good for practicing specific sets.</p>
                          
                          <div className="mb-2 bg-black/40 p-3 border border-white/10">
                            <div className="flex justify-between items-end mb-2">
                              <span className="text-xs uppercase font-bold text-yellow-400">Difficulty</span>
                              <span className="text-xl font-mono text-white">{selectedLevel}</span>
                            </div>
                            <input type="range" min="0" max="50" value={selectedLevel} onChange={(e) => setSelectedLevel(parseInt(e.target.value))} className="w-full h-2 bg-gray-900 rounded-none appearance-none cursor-pointer border border-gray-700" style={{ background: `linear-gradient(90deg, #00ffff ${selectedLevel * 2}%, #333 ${selectedLevel * 2}%)` }} />
                            <div className="text-[10px] text-cyan-300 font-mono mt-2 text-right">{selectedConfig.description}</div>
                          </div>
                        </div>
                        <button onClick={() => startGame('training')} className="w-full mt-4 bg-cyan-700 hover:bg-cyan-600 text-white font-bold py-3 uppercase tracking-widest shadow-[4px_4px_0_#155e75] active:shadow-none active:translate-x-1 active:translate-y-1 transition-all">
                          START LOOP
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* GAME OVER */}
            {gameState === 'gameover' && (
              <div className="absolute inset-0 z-30 flex items-center justify-center backdrop-blur-md bg-red-900/30">
                <div className="bg-black border-4 border-red-600 w-full max-w-md p-10 text-center shadow-[0_0_100px_red]">
                  <h2 className="text-5xl font-black text-red-500 mb-2 tracking-tighter">GAME OVER</h2>
                  <p className="text-red-300 font-mono text-sm mb-8 animate-pulse">SYSTEM FAILURE // TRY AGAIN</p>
                  
                  <div className="bg-gray-900 p-6 mb-8 border border-gray-700">
                    <div className="flex justify-between items-center border-b border-gray-800 pb-2 mb-2">
                      <span className="text-gray-500 uppercase text-xs">Final Score</span>
                      <span className="text-2xl font-mono text-white">{score.toLocaleString()}</span>
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
                    <button onClick={() => startGame(gameMode)} className="w-full bg-white text-black font-black py-4 uppercase tracking-widest hover:bg-cyan-400 transition-colors">
                      Retry {gameMode}
                    </button>
                    <button onClick={() => setGameState('menu')} className="w-full bg-transparent border-2 border-white text-white font-bold py-3 uppercase hover:bg-white hover:text-black transition-colors">
                      Menu
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* PAUSED */}
            {gameState === 'paused' && (
              <div className="absolute inset-0 z-40 flex items-center justify-center backdrop-blur-sm bg-black/80">
                <div className="bg-[#120024] border-2 border-cyan-500 p-8 rounded-xl shadow-[0_0_50px_rgba(0,255,255,0.3)] w-full max-w-lg">
                  <h2 className="text-3xl font-black italic text-center text-white mb-6 tracking-wide border-b border-gray-700 pb-4">
                    SYSTEM PAUSED
                  </h2>

                  <div className="mb-8">
                    <div className="text-xs text-center text-gray-400 mb-2 uppercase tracking-widest">Touch Typing Guide</div>
                    <div className="bg-black/50 p-4 rounded-xl border border-gray-700 w-full max-w-lg mx-auto mb-6">
                      <div className="flex flex-col gap-1 items-center">
                        {KEYBOARD_ROWS.map((row, i) => (
                          <div key={i} className="flex gap-1 justify-center w-full">
                            {row.map((keyData, j) => {
                              const isActive = activeKey === keyData.k;
                              return (
                                <div key={j} className="w-8 h-8 flex items-center justify-center rounded text-xs font-bold shadow-sm transition-all duration-75" style={{ backgroundColor: isActive ? '#ffffff' : FINGER_COLORS[keyData.f], color: isActive ? FINGER_COLORS[keyData.f] : '#000000', transform: isActive ? 'scale(1.15)' : 'scale(1)', boxShadow: isActive ? `0 0 15px ${FINGER_COLORS[keyData.f]}, 0 0 5px white` : 'none', zIndex: isActive ? 10 : 1 }}>
                                  {keyData.k.toUpperCase()}
                                </div>
                              );
                            })}
                          </div>
                        ))}
                      </div>
                      <div className="flex justify-between text-[10px] text-gray-400 mt-3 px-4 uppercase font-mono tracking-wider">
                        <span className="text-red-500">Left Pinky</span>
                        <span className="text-cyan-500">Right Index</span>
                        <span className="text-pink-500">Right Pinky</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <button onClick={() => setGameState('playing')} className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-4 rounded shadow-[0_4px_0_#155e75] active:shadow-none active:translate-y-1 transition-all flex items-center justify-center gap-2">
                      <Play fill="currentColor" size={20} /> RESUME
                    </button>
                    
                    <div className="flex flex-col gap-2">
                      <button onClick={() => startGame(gameMode)} className="bg-gray-800 hover:bg-gray-700 text-gray-300 font-bold py-2 rounded flex items-center justify-center gap-2 text-sm">
                        <RotateCcw size={16} /> RESTART
                      </button>
                      <button onClick={() => setGameState('menu')} className="bg-red-900/50 hover:bg-red-900 text-red-300 font-bold py-2 rounded flex items-center justify-center gap-2 text-sm">
                        <LogOut size={16} /> QUIT TO TITLE
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        )}
      </div>
    </div>
  );
}

export default function TypeRunnerPage() {
  return (
    <AIProjectPageWrapper>
      <TypeRunnerGame />
    </AIProjectPageWrapper>
  );
}
