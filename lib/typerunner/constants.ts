/**
 * Game configuration constants
 */

import { KeyData, FingerType } from './types';

// --- GAME CONFIGURATION ---
export const LANE_WIDTH = 600;
export const CRITICAL_LINE_Y_PCT = 0.82;
export const MAX_LIVES = 5;

// --- AESTHETIC CONFIG (NEON ARCADE) ---
export const THEME = {
  bg: '#090014', // Deep void purple
  laneBg: '#120024',
  primary: '#ff00ff', // Hot Magenta
  secondary: '#00ffff', // Cyan
  tertiary: '#ffff00', // Electric Yellow
  text: '#ffffff',
  textDim: 'rgba(255,255,255,0.5)',
  danger: '#ff2a2a', // Arcade Red
  success: '#39ff14', // Neon Green
  grid: 'rgba(255, 0, 255, 0.15)',
};

// --- KEYBOARD GUIDE DATA ---
export const KEYBOARD_ROWS: KeyData[][] = [
  [
    { k: '1', f: 'lp' },
    { k: '2', f: 'lr' },
    { k: '3', f: 'lm' },
    { k: '4', f: 'li' },
    { k: '5', f: 'li' },
    { k: '6', f: 'ri' },
    { k: '7', f: 'ri' },
    { k: '8', f: 'rm' },
    { k: '9', f: 'rr' },
    { k: '0', f: 'rp' },
    { k: '-', f: 'rp' },
    { k: '=', f: 'rp' },
  ],
  [
    { k: 'q', f: 'lp' },
    { k: 'w', f: 'lr' },
    { k: 'e', f: 'lm' },
    { k: 'r', f: 'li' },
    { k: 't', f: 'li' },
    { k: 'y', f: 'ri' },
    { k: 'u', f: 'ri' },
    { k: 'i', f: 'rm' },
    { k: 'o', f: 'rr' },
    { k: 'p', f: 'rp' },
    { k: '[', f: 'rp' },
    { k: ']', f: 'rp' },
  ],
  [
    { k: 'a', f: 'lp' },
    { k: 's', f: 'lr' },
    { k: 'd', f: 'lm' },
    { k: 'f', f: 'li' },
    { k: 'g', f: 'li' },
    { k: 'h', f: 'ri' },
    { k: 'j', f: 'ri' },
    { k: 'k', f: 'rm' },
    { k: 'l', f: 'rr' },
    { k: ';', f: 'rp' },
    { k: "'", f: 'rp' },
  ],
  [
    { k: 'z', f: 'lp' },
    { k: 'x', f: 'lr' },
    { k: 'c', f: 'lm' },
    { k: 'v', f: 'li' },
    { k: 'b', f: 'li' },
    { k: 'n', f: 'ri' },
    { k: 'm', f: 'ri' },
    { k: ',', f: 'rm' },
    { k: '.', f: 'rr' },
    { k: '/', f: 'rp' },
  ],
];

export const FINGER_COLORS: Record<FingerType, string> = {
  lp: '#ef4444', // Left Pinky (Red)
  lr: '#f97316', // Left Ring (Orange)
  lm: '#eab308', // Left Middle (Yellow)
  li: '#22c55e', // Left Index (Green)
  ri: '#06b6d4', // Right Index (Cyan)
  rm: '#3b82f6', // Right Middle (Blue)
  rr: '#a855f7', // Right Ring (Purple)
  rp: '#ec4899', // Right Pinky (Pink)
};

