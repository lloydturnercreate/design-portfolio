/**
 * TypeScript type definitions for TypeRunner game
 */

export type GameState = 'menu' | 'playing' | 'paused' | 'gameover';
export type GameMode = 'waterfall' | 'training';

export interface Word {
  id: number;
  text: string;
  x: number;
  y: number;
  typedIndex: number;
  completed: boolean;
  missed: boolean;
  color: string;
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  color: string;
}

export interface FloatingText {
  x: number;
  y: number;
  text: string;
  color: string;
  size: number;
  life: number;
  vy: number;
}

export interface LevelConfig {
  speed: number;
  spawnRate: number;
  pool: string[];
  description: string;
}

export interface KeyData {
  k: string;
  f: FingerType;
}

export type FingerType = 'lp' | 'lr' | 'lm' | 'li' | 'ri' | 'rm' | 'rr' | 'rp';

export interface GameStats {
  score: number;
  streak: number;
  multiplier: number;
  lives: number;
  wpm: number;
  currentLevel: number;
}

