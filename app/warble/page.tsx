'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Square, Volume2, RefreshCcw, Share2, Dice6, Layers, Save, Smartphone, Music, ArrowLeft, Moon, Sun } from 'lucide-react';
import AIProjectPageWrapper from '@/app/components/transitions/AIProjectPageWrapper';
import Link from 'next/link';

/**
 * Audio Constants & Utilities
 */
const NOTE_FREQS = {
  'C6': 1046.50, 'B5': 987.77, 'Bb5': 932.33, 'A5': 880.00, 'Ab5': 830.61, 'G5': 783.99, 'Gb5': 739.99, 'F5': 698.46,
  'E5': 659.25, 'Eb5': 622.25, 'D5': 587.33, 'Db5': 554.37, 'C5': 523.25, 'B4': 493.88, 'Bb4': 466.16, 'A4': 440.00, 'G4': 392.00
};

const SCALES = {
  pentatonic: ['C6', 'A5', 'G5', 'E5', 'D5', 'C5', 'A4', 'G4'],
  major: ['C6', 'B5', 'A5', 'G5', 'F5', 'E5', 'D5', 'C5'],
  minor: ['C6', 'Bb5', 'Ab5', 'G5', 'F5', 'Eb5', 'D5', 'C5'],
  chromatic: ['C6', 'B5', 'Bb5', 'A5', 'Ab5', 'G5', 'Gb5', 'F5']
};

const INSTRUMENTS = {
  marimba: { type: 'sine', attack: 0.01, decay: 0.4, sustain: 0, release: 0.1, filterType: 'lowpass', filterFreq: 800 },
  pluck: { type: 'triangle', attack: 0.005, decay: 0.3, sustain: 0, release: 0.1, filterType: 'lowpass', filterFreq: 1500 },
  kalimba: { type: 'triangle', attack: 0.003, decay: 0.5, sustain: 0.1, release: 0.3, filterType: 'bandpass', filterFreq: 1800 },
  synth: { type: 'sawtooth', attack: 0.05, decay: 0.2, sustain: 0.3, release: 0.5, filterType: 'lowpass', filterFreq: 2000 },
  bass: { type: 'sawtooth', attack: 0.02, decay: 0.3, sustain: 0.4, release: 0.2, filterType: 'lowpass', filterFreq: 400 },
  drum: { type: 'triangle', attack: 0.001, decay: 0.15, sustain: 0, release: 0.05, filterType: 'highpass', filterFreq: 200 }
};

const STEPS = 16;
const ROWS = 8;

// Reverb Impulse Generator
const createReverbImpulse = (ctx: AudioContext) => {
  const length = ctx.sampleRate * 2.0;
  const impulse = ctx.createBuffer(2, length, ctx.sampleRate);
  for (let i = 0; i < 2; i++) {
    const channel = impulse.getChannelData(i);
    for (let j = 0; j < length; j++) {
      channel[j] = (Math.random() * 2 - 1) * Math.pow(1 - j / length, 2);
    }
  }
  return impulse;
};

// WAV Export Helper
const bufferToWave = (abuffer: AudioBuffer, len: number) => {
  let numOfChan = abuffer.numberOfChannels,
      length = len * numOfChan * 2 + 44,
      buffer = new ArrayBuffer(length),
      view = new DataView(buffer),
      channels = [], i, sample,
      offset = 0,
      pos = 0;

  function setUint16(data: number) { view.setUint16(pos, data, true); pos += 2; }
  function setUint32(data: number) { view.setUint32(pos, data, true); pos += 4; }

  setUint32(0x46464952); setUint32(length - 8); setUint32(0x45564157);
  setUint32(0x20746d66); setUint32(16); setUint16(1); setUint16(numOfChan);
  setUint32(abuffer.sampleRate); setUint32(abuffer.sampleRate * 2 * numOfChan);
  setUint16(numOfChan * 2); setUint16(16); setUint32(0x61746164);
  setUint32(length - pos - 40);

  for(i = 0; i < abuffer.numberOfChannels; i++) channels.push(abuffer.getChannelData(i));

  while(pos < len) {
    for(i = 0; i < numOfChan; i++) {
      sample = Math.max(-1, Math.min(1, channels[i][pos]));
      sample = (0.5 + sample < 0 ? sample * 32768 : sample * 32767)|0;
      view.setInt16(44 + offset, sample, true);
      offset += 2;
    }
    pos++;
  }
  return new Blob([buffer], {type: "audio/wav"});
};

function WarbleApp() {
  // --- State ---
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeStep, setActiveStep] = useState(-1);
  const [bpm, setBpm] = useState(140);
  const [selectedInstrument, setSelectedInstrument] = useState<keyof typeof INSTRUMENTS>('marimba');
  const [selectedScale, setSelectedScale] = useState<keyof typeof SCALES>('pentatonic');
  const [volume, setVolume] = useState(75);
  const [reverbAmt, setReverbAmt] = useState(30);
  const [patternLength, setPatternLength] = useState(16);
  const [grid, setGrid] = useState(Array(ROWS).fill(null).map(() => Array(16).fill(false)));
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawState, setDrawState] = useState(true); // adding vs removing
  const [activeSlot, setActiveSlot] = useState(1);
  const [isDarkMode, setIsDarkMode] = useState(true); // Default to dark mode
  const [swing, setSwing] = useState(0); // 0-50% swing amount
  const [loopCount, setLoopCount] = useState(1); // 1x, 2x, 4x, 8x
  const [fadeIn, setFadeIn] = useState(false);
  const [fadeOut, setFadeOut] = useState(true);
  
  // --- Refs ---
  const audioCtxRef = useRef<AudioContext | null>(null);
  const reverbNodeRef = useRef<ConvolverNode | null>(null);
  const lookaheadTimerRef = useRef<number | null>(null);
  const nextNoteTimeRef = useRef(0);
  const stepRef = useRef(0);

  // --- Initialization & Audio Engine ---
  const initAudio = () => {
    if (!audioCtxRef.current) {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      audioCtxRef.current = new AudioContext();
      
      // Setup Master Reverb Bus
      reverbNodeRef.current = audioCtxRef.current.createConvolver();
      reverbNodeRef.current.buffer = createReverbImpulse(audioCtxRef.current);
      reverbNodeRef.current.connect(audioCtxRef.current.destination);
    }
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
  };

  const playSound = (ctx: AudioContext | OfflineAudioContext, freq: number, time: number, instrumentName: keyof typeof INSTRUMENTS, vol: number, reverbLevel: number) => {
    const inst = INSTRUMENTS[instrumentName];
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();
    const filter = ctx.createBiquadFilter();
    
    // Reverb Send
    const reverbGain = ctx.createGain();
    reverbGain.gain.value = reverbLevel / 100;

    osc.type = inst.type as OscillatorType;
    osc.frequency.value = freq;
    filter.type = inst.filterType as BiquadFilterType;
    filter.frequency.value = inst.filterFreq;

    const now = time;
    const volumeScale = vol / 100;
    
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(volumeScale, now + inst.attack);
    gainNode.gain.exponentialRampToValueAtTime(inst.sustain * volumeScale + 0.001, now + inst.attack + inst.decay);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + inst.attack + inst.decay + inst.release);

    osc.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    // Connect to reverb if not offline context (offline reverb is heavy, optional)
    if (reverbNodeRef.current && ctx === audioCtxRef.current) {
      gainNode.connect(reverbGain);
      reverbGain.connect(reverbNodeRef.current);
    }

    osc.start(now);
    osc.stop(now + inst.attack + inst.decay + inst.release + 1);
  };

  // --- Scheduler ---
  const scheduleNote = (stepNumber: number, time: number) => {
    const currentScaleNotes = SCALES[selectedScale];
    
    // Schedule visual update to match audio timing
    if (audioCtxRef.current) {
      const currentTime = audioCtxRef.current.currentTime;
      const delay = Math.max(0, (time - currentTime) * 1000); // Convert to milliseconds
      setTimeout(() => {
        setActiveStep(stepNumber);
      }, delay);
    }
    
    // Apply swing to odd-numbered steps
    const secondsPerBeat = 60.0 / bpm;
    const secondsPerStep = secondsPerBeat / 4;
    const swingOffset = stepNumber % 2 === 1 ? (swing / 100) * (secondsPerStep * 0.5) : 0;
    const adjustedTime = time + swingOffset;

    grid.forEach((row, rowIndex) => {
      if (row[stepNumber]) {
        const freq = NOTE_FREQS[currentScaleNotes[rowIndex] as keyof typeof NOTE_FREQS];
        if (audioCtxRef.current) {
          playSound(audioCtxRef.current, freq, adjustedTime, selectedInstrument, volume, reverbAmt);
        }
      }
    });
  };

  const nextNote = () => {
    const secondsPerBeat = 60.0 / bpm;
    const secondsPerStep = secondsPerBeat / 4;
    nextNoteTimeRef.current += secondsPerStep;
    stepRef.current = (stepRef.current + 1) % patternLength;
  };

  const scheduler = useCallback(() => {
    if (!audioCtxRef.current) return;
    while (nextNoteTimeRef.current < audioCtxRef.current.currentTime + 0.1) {
      scheduleNote(stepRef.current, nextNoteTimeRef.current);
      nextNote();
    }
    lookaheadTimerRef.current = window.setTimeout(scheduler, 25);
  }, [bpm, grid, selectedInstrument, volume, reverbAmt, selectedScale, swing]);

  useEffect(() => {
    if (isPlaying) {
      initAudio();
      stepRef.current = 0;
      if (audioCtxRef.current) {
        nextNoteTimeRef.current = audioCtxRef.current.currentTime;
      }
      scheduler();
    } else {
      if (lookaheadTimerRef.current !== null) {
        window.clearTimeout(lookaheadTimerRef.current);
      }
      setActiveStep(-1);
    }
    return () => {
      if (lookaheadTimerRef.current !== null) {
        window.clearTimeout(lookaheadTimerRef.current);
      }
    };
  }, [isPlaying, scheduler]);

  // --- Interaction Logic (Paint Mode) ---
  const handleMouseDown = (r: number, c: number) => {
    setIsDrawing(true);
    const newState = !grid[r][c];
    setDrawState(newState);
    toggleCell(r, c, newState);
  };

  const handleMouseEnter = (r: number, c: number) => {
    if (isDrawing) {
      toggleCell(r, c, drawState);
    }
  };

  const handleMouseUp = () => setIsDrawing(false);

  const toggleCell = (row: number, col: number, state: boolean) => {
    const newGrid = grid.map(r => [...r]); // Deep copy needed
    newGrid[row][col] = state;
    setGrid(newGrid);
    
    // Preview sound
    if (!isPlaying && state) {
      initAudio();
      const currentScaleNotes = SCALES[selectedScale];
      if (audioCtxRef.current) {
        playSound(audioCtxRef.current, NOTE_FREQS[currentScaleNotes[row] as keyof typeof NOTE_FREQS], audioCtxRef.current.currentTime, selectedInstrument, volume, reverbAmt);
      }
    }
  };

  // --- Keyboard Shortcuts ---
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        setIsPlaying(prev => !prev);
      } else if (e.code === 'KeyC') {
        clearGrid();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // --- URL & Storage Logic ---
  useEffect(() => {
    // Load dark mode preference
    const savedDarkMode = localStorage.getItem('warble_dark_mode');
    if (savedDarkMode !== null) {
      setIsDarkMode(savedDarkMode === 'true');
    }

    // Load from Hash on Mount
    const hash = window.location.hash.slice(1);
    if (hash) {
      try {
        const decoded = JSON.parse(atob(hash));
        setGrid(decoded.grid);
        setBpm(decoded.bpm);
        setSelectedInstrument(decoded.instrument);
        setSelectedScale(decoded.scale || 'pentatonic');
      } catch (e) { /* Invalid hash */ }
    } else {
      loadSlot(1);
    }
  }, []);

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    localStorage.setItem('warble_dark_mode', String(newMode));
  };

  const saveSlot = (slot: number) => {
    localStorage.setItem(`ringtone_slot_${slot}`, JSON.stringify({ grid, bpm, instrument: selectedInstrument, scale: selectedScale }));
    setActiveSlot(slot);
  };

  const loadSlot = (slot: number) => {
    const data = localStorage.getItem(`ringtone_slot_${slot}`);
    if (data) {
      const parsed = JSON.parse(data);
      setGrid(parsed.grid);
      setBpm(parsed.bpm);
      setSelectedInstrument(parsed.instrument);
      setSelectedScale(parsed.scale || 'pentatonic');
    }
    setActiveSlot(slot);
  };

  const copyShareLink = () => {
    const state = { grid, bpm, instrument: selectedInstrument, scale: selectedScale };
    const hash = btoa(JSON.stringify(state));
    const url = `${window.location.origin}${window.location.pathname}#${hash}`;
    navigator.clipboard.writeText(url);
    alert("Link copied to clipboard!"); // Ideally use a toast
  };

  // --- Generators ---
  const clearGrid = () => {
    setGrid(Array(ROWS).fill(null).map(() => Array(patternLength).fill(false)));
    if(isPlaying) setIsPlaying(false);
  };

  const randomizePattern = () => {
    const newGrid = Array(ROWS).fill(null).map(() => Array(patternLength).fill(false));
    // Heuristic: Prefer downbeats and chord tones
    for (let c = 0; c < patternLength; c++) {
      if (Math.random() > 0.6) { // 40% chance of a note in a column
        const r = Math.floor(Math.random() * ROWS);
        newGrid[r][c] = true;
      }
    }
    setGrid(newGrid);
  };

  const handlePatternLengthChange = (newLength: number) => {
    // Check if there are any notes in the grid
    const hasNotes = grid.some(row => row.some(cell => cell));
    
    if (hasNotes) {
      const confirmed = window.confirm(`Changing pattern length will affect your current pattern. Continue?`);
      if (!confirmed) return;
    }
    
    // Stop playback
    if (isPlaying) setIsPlaying(false);
    
    // Create new grid with the new length
    const newGrid = Array(ROWS).fill(null).map((_, rowIdx) => {
      const newRow = Array(newLength).fill(false);
      // Preserve existing notes up to the new length
      for (let i = 0; i < Math.min(newLength, patternLength); i++) {
        if (grid[rowIdx] && grid[rowIdx][i]) {
          newRow[i] = true;
        }
      }
      return newRow;
    });
    
    setPatternLength(newLength);
    setGrid(newGrid);
  };

  const handleExport = async () => {
    setIsPlaying(false);
    const patternDuration = (60 / bpm) * (patternLength / 4);
    const totalDuration = patternDuration * loopCount;
    const offlineCtx = new OfflineAudioContext(2, 44100 * totalDuration, 44100);
    const currentScaleNotes = SCALES[selectedScale];
    const secondsPerBeat = 60.0 / bpm;
    const secondsPerStep = secondsPerBeat / 4;

    // Render all loops
    for (let loop = 0; loop < loopCount; loop++) {
      const loopOffset = loop * patternDuration;
      
      for (let s = 0; s < patternLength; s++) {
        const time = loopOffset + (s * secondsPerStep);
        grid.forEach((row, rowIndex) => {
          if (row[s]) {
            playSound(offlineCtx, NOTE_FREQS[currentScaleNotes[rowIndex] as keyof typeof NOTE_FREQS], time, selectedInstrument, volume, 0);
          }
        });
      }
    }

    const renderedBuffer = await offlineCtx.startRendering();
    
    // Apply fade in/out envelopes
    if (fadeIn || fadeOut) {
      const fadeInSamples = fadeIn ? Math.floor(0.05 * renderedBuffer.sampleRate) : 0; // 50ms fade in
      const fadeOutSamples = fadeOut ? Math.floor(0.2 * renderedBuffer.sampleRate) : 0; // 200ms fade out
      
      for (let channel = 0; channel < renderedBuffer.numberOfChannels; channel++) {
        const channelData = renderedBuffer.getChannelData(channel);
        
        // Fade in
        if (fadeIn) {
          for (let i = 0; i < fadeInSamples; i++) {
            channelData[i] *= i / fadeInSamples;
          }
        }
        
        // Fade out
        if (fadeOut) {
          const startFadeOut = channelData.length - fadeOutSamples;
          for (let i = 0; i < fadeOutSamples; i++) {
            channelData[startFadeOut + i] *= 1 - (i / fadeOutSamples);
          }
        }
      }
    }
    
    const wavBlob = bufferToWave(renderedBuffer, renderedBuffer.length);
    const url = URL.createObjectURL(wavBlob);
    
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = `Warble-${Date.now()}.wav`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div 
      className={`min-h-screen font-sans flex flex-col p-4 md:p-8 transition-colors duration-300 ${
        isDarkMode 
          ? 'bg-[#1a1a1a] text-gray-100 selection:bg-purple-500/30' 
          : 'bg-[#F2F2F7] text-gray-900 selection:bg-blue-200'
      }`}
      onMouseUp={handleMouseUp} // Global mouse up to catch drags outside grid
    >
      {/* Back Button & Dark Mode Toggle */}
      <div className="mb-4 md:mb-6 max-w-4xl mx-auto w-full flex items-center justify-between gap-2">
        <Link 
          href="/#experiments"
          className={`group inline-flex items-center gap-2 md:gap-3 transition-all duration-300 backdrop-blur-sm px-4 md:px-6 py-2 md:py-3 border rounded-lg hover:shadow-lg text-sm md:text-base ${
            isDarkMode
              ? 'text-gray-300 hover:text-white bg-gray-800/80 border-gray-700 hover:border-gray-600'
              : 'text-gray-700 hover:text-gray-900 bg-white/80 border-gray-300 hover:border-gray-400'
          }`}
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform md:w-5 md:h-5" />
          <span className="font-bold uppercase tracking-wider text-xs md:text-sm">Back</span>
        </Link>

        {/* Dark Mode Toggle */}
        <button
          onClick={toggleDarkMode}
          className={`p-2 md:p-3 rounded-lg transition-all duration-300 ${
            isDarkMode
              ? 'bg-gray-800 text-yellow-400 hover:bg-gray-700 border border-gray-700'
              : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
          }`}
          title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {isDarkMode ? <Sun size={18} className="md:w-5 md:h-5" /> : <Moon size={18} className="md:w-5 md:h-5" />}
        </button>
      </div>

      <div className={`w-full max-w-4xl mx-auto rounded-2xl md:rounded-[2.5rem] shadow-2xl overflow-hidden border relative transition-colors duration-300 ${
        isDarkMode
          ? 'bg-[#2a2a2a] border-gray-700'
          : 'bg-white border-gray-200'
      }`}>
        
        {/* Header */}
        <div className={`h-12 md:h-14 backdrop-blur-xl flex items-center justify-between px-4 md:px-6 border-b sticky top-0 z-20 transition-colors duration-300 ${
          isDarkMode
            ? 'bg-[#2a2a2a]/80 border-gray-700'
            : 'bg-white/80 border-gray-100'
        }`}>
            <div className="flex items-center gap-1.5 md:gap-2">
                <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-red-500 hover:bg-red-600 transition-colors cursor-pointer" title="Reset" onClick={clearGrid}></div>
                <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-yellow-500"></div>
                <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-green-500"></div>
            </div>
            {/* Warble Logo */}
            <div className={`flex items-center gap-1.5 md:gap-2 transition-colors duration-300 ${
              isDarkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>
              {/* Sound Wave Icon */}
              <svg width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="md:w-5 md:h-5">
                <path d="M2 10 Q 4 6, 6 10 T 10 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
                <path d="M10 10 Q 12 14, 14 10 T 18 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
                <path d="M4 10 Q 6 12, 8 10 T 12 10" stroke="currentColor" strokeWidth="1" strokeLinecap="round" fill="none" opacity="0.6"/>
              </svg>
              <span className="font-semibold text-xs md:text-sm tracking-wider uppercase">Warble</span>
            </div>
            <div className="flex gap-1.5 md:gap-2">
              {[1, 2, 3].map(slot => (
                <button
                  key={slot}
                  onClick={() => loadSlot(slot)}
                  onDoubleClick={() => saveSlot(slot)}
                  className={`w-5 h-5 md:w-6 md:h-6 rounded-full text-[9px] md:text-[10px] font-bold transition-all border
                    ${activeSlot === slot 
                      ? 'bg-blue-500 text-white border-blue-500' 
                      : isDarkMode
                        ? 'bg-gray-700 text-gray-400 border-transparent hover:border-gray-600'
                        : 'bg-gray-100 text-gray-400 border-transparent hover:border-gray-300'
                    }
                  `}
                  title="Click to load, Double-click to save"
                >
                  {slot}
                </button>
              ))}
            </div>
        </div>

        <div className="p-4 md:p-6 lg:p-8 space-y-4 md:space-y-6">
            
            {/* Top Controls Grid */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6">
                
                {/* Instruments & Scale (Left Col) */}
                <div className="md:col-span-5 space-y-4">
                    {/* Instruments */}
                    <div className="space-y-2">
                        <label className={`text-xs font-bold tracking-wider uppercase flex justify-between transition-colors duration-300 ${
                          isDarkMode ? 'text-gray-500' : 'text-gray-400'
                        }`}>
                          <span>Instrument</span>
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                            {Object.keys(INSTRUMENTS).map(inst => (
                                <button
                                    key={inst}
                                    onClick={() => setSelectedInstrument(inst as keyof typeof INSTRUMENTS)}
                                    className={`py-2 px-3 rounded-lg text-xs font-medium transition-all duration-200 capitalize border
                                        ${selectedInstrument === inst 
                                            ? 'bg-blue-500/20 border-blue-500/50 text-blue-400 shadow-sm' 
                                            : isDarkMode
                                              ? 'bg-gray-800 border-gray-700 text-gray-400 hover:bg-gray-700'
                                              : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                                        }`}
                                >
                                    {inst}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Scale Selector */}
                    <div className="space-y-2">
                         <label className={`text-xs font-bold tracking-wider uppercase transition-colors duration-300 ${
                           isDarkMode ? 'text-gray-500' : 'text-gray-400'
                         }`}>Scale</label>
                         <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                            {Object.keys(SCALES).map(s => (
                              <button
                                key={s}
                                onClick={() => setSelectedScale(s as keyof typeof SCALES)}
                                className={`py-2 px-2 rounded-lg text-xs font-medium transition-all capitalize border truncate
                                  ${selectedScale === s 
                                    ? 'bg-purple-500/20 border-purple-500/50 text-purple-400' 
                                    : isDarkMode
                                      ? 'bg-gray-800 border-gray-700 text-gray-400 hover:bg-gray-700'
                                      : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                                  }`}
                              >
                                {s}
                              </button>
                            ))}
                         </div>
                    </div>

                    {/* Pattern Length Selector */}
                    <div className="space-y-2">
                         <label className={`text-xs font-bold tracking-wider uppercase transition-colors duration-300 ${
                           isDarkMode ? 'text-gray-500' : 'text-gray-400'
                         }`}>Pattern Length</label>
                         <div className="grid grid-cols-3 gap-2">
                            {[8, 16, 32].map(len => (
                              <button
                                key={len}
                                onClick={() => handlePatternLengthChange(len)}
                                className={`py-2 px-2 rounded-lg text-xs font-medium transition-all border
                                  ${patternLength === len 
                                    ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-400' 
                                    : isDarkMode
                                      ? 'bg-gray-800 border-gray-700 text-gray-400 hover:bg-gray-700'
                                      : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                                  }`}
                              >
                                {len}
                              </button>
                            ))}
                         </div>
                    </div>
                </div>

                {/* Params (Middle Col) */}
                <div className={`md:col-span-4 rounded-2xl p-4 border flex flex-col justify-center gap-4 md:gap-5 transition-colors duration-300 ${
                  isDarkMode
                    ? 'bg-gray-800/50 border-gray-700'
                    : 'bg-gray-50/80 border-gray-100'
                }`}>
                    
                    {/* BPM */}
                    <div className="flex items-center gap-3">
                        <RefreshCcw size={14} className={isDarkMode ? 'text-gray-500' : 'text-gray-400'} />
                        <span className={`text-xs font-bold w-8 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>BPM</span>
                        <input 
                            type="range" min="60" max="200" 
                            value={bpm} onChange={(e) => setBpm(Number(e.target.value))}
                            className={`flex-1 h-1.5 rounded-lg appearance-none cursor-pointer accent-blue-500 ${
                              isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
                            }`}
                        />
                        <span className={`text-xs font-mono w-8 text-right ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{bpm}</span>
                    </div>

                    {/* Volume */}
                    <div className="flex items-center gap-3">
                        <Volume2 size={14} className={isDarkMode ? 'text-gray-500' : 'text-gray-400'} />
                        <span className={`text-xs font-bold w-8 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>VOL</span>
                        <input 
                            type="range" min="0" max="100" 
                            value={volume} onChange={(e) => setVolume(Number(e.target.value))}
                            className={`flex-1 h-1.5 rounded-lg appearance-none cursor-pointer accent-green-500 ${
                              isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
                            }`}
                        />
                        <span className={`text-xs font-mono w-8 text-right ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{volume}</span>
                    </div>

                    {/* Reverb */}
                    <div className="flex items-center gap-3">
                        <Layers size={14} className={isDarkMode ? 'text-gray-500' : 'text-gray-400'} />
                        <span className={`text-xs font-bold w-8 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>VRB</span>
                        <input 
                            type="range" min="0" max="100" 
                            value={reverbAmt} onChange={(e) => setReverbAmt(Number(e.target.value))}
                            className={`flex-1 h-1.5 rounded-lg appearance-none cursor-pointer accent-purple-500 ${
                              isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
                            }`}
                        />
                        <span className={`text-xs font-mono w-8 text-right ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{reverbAmt}</span>
                    </div>

                    {/* Swing */}
                    <div className="flex items-center gap-3">
                        <Music size={14} className={isDarkMode ? 'text-gray-500' : 'text-gray-400'} />
                        <span className={`text-xs font-bold w-8 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>SWG</span>
                        <input 
                            type="range" min="0" max="50" 
                            value={swing} onChange={(e) => setSwing(Number(e.target.value))}
                            className={`flex-1 h-1.5 rounded-lg appearance-none cursor-pointer accent-pink-500 ${
                              isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
                            }`}
                        />
                        <span className={`text-xs font-mono w-8 text-right ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{swing}</span>
                    </div>
                </div>

                {/* Actions (Right Col) */}
                <div className="md:col-span-3 grid grid-cols-2 gap-2 md:gap-3">
                   <button onClick={randomizePattern} className={`flex flex-col items-center justify-center gap-1 rounded-xl p-3 md:p-2 transition-colors border ${
                     isDarkMode
                       ? 'bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-400 border-indigo-500/30'
                       : 'bg-indigo-50 hover:bg-indigo-100 text-indigo-600 border-indigo-100'
                   }`}>
                      <Dice6 size={20} />
                      <span className="text-[10px] font-bold uppercase">Random</span>
                   </button>
                   <button onClick={copyShareLink} className={`flex flex-col items-center justify-center gap-1 rounded-xl p-3 md:p-2 transition-colors border ${
                     isDarkMode
                       ? 'bg-orange-500/20 hover:bg-orange-500/30 text-orange-400 border-orange-500/30'
                       : 'bg-orange-50 hover:bg-orange-100 text-orange-600 border-orange-100'
                   }`}>
                      <Share2 size={20} />
                      <span className="text-[10px] font-bold uppercase">Share</span>
                   </button>
                   <button onClick={() => saveSlot(activeSlot)} className={`flex flex-col items-center justify-center gap-1 rounded-xl p-3 md:p-2 transition-colors border col-span-2 ${
                     isDarkMode
                       ? 'bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border-emerald-500/30'
                       : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-600 border-emerald-100'
                   }`}>
                      <Save size={20} />
                      <span className="text-[10px] font-bold uppercase">Save to Slot {activeSlot}</span>
                   </button>
                </div>
            </div>

            {/* Sequencer Grid */}
            <div className={`rounded-2xl md:rounded-3xl p-3 md:p-5 shadow-inner overflow-x-auto relative select-none touch-none transition-colors duration-300 ${
              isDarkMode ? 'bg-[#1a1a1a]' : 'bg-[#1c1c1e]'
            }`} onMouseLeave={handleMouseUp}>

                <div className="flex flex-col gap-1 md:gap-1.5 min-w-[500px] md:min-w-[600px]">
                    {grid.map((row, rowIndex) => (
                        <div key={rowIndex} className="flex gap-1 md:gap-1.5 h-8 md:h-9">
                             {/* Note Label */}
                            <div className={`w-8 md:w-10 flex items-center justify-center text-[9px] md:text-[10px] font-bold transition-colors ${
                              isDarkMode ? 'text-gray-500' : 'text-gray-600'
                            }`}>
                                {SCALES[selectedScale][rowIndex]}
                            </div>
                            {/* Steps */}
                            {row.map((cell, colIndex) => {
                                const isBeat = colIndex % 4 === 0;
                                const isActive = cell;
                                const isPlayhead = colIndex === activeStep;
                                const isPlaying = isPlayhead && isActive;

                                return (
                                    <div
                                        key={colIndex}
                                        onMouseDown={() => handleMouseDown(rowIndex, colIndex)}
                                        onMouseEnter={() => handleMouseEnter(rowIndex, colIndex)}
                                        className={`flex-1 rounded-md transition-all duration-150 border relative z-10 cursor-pointer
                                            ${isActive 
                                                ? isPlaying
                                                  ? 'bg-blue-500 border-blue-300 shadow-[0_0_20px_rgba(59,130,246,0.9)] scale-105 brightness-125' 
                                                  : 'bg-blue-500 border-blue-400 shadow-[0_0_12px_rgba(59,130,246,0.6)]'
                                                : isPlayhead
                                                  ? isBeat
                                                    ? isDarkMode
                                                      ? 'bg-[#3a3a3c] border-[#4a4a4c]'
                                                      : 'bg-[#383838] border-[#484848]'
                                                    : isDarkMode
                                                      ? 'bg-[#353537] border-[#3a3a3c]'
                                                      : 'bg-[#353535] border-[#383838]'
                                                  : isBeat 
                                                    ? isDarkMode
                                                      ? 'bg-[#2c2c2e] border-[#3a3a3c] hover:bg-[#3a3a3c]'
                                                      : 'bg-[#2a2a2a] border-[#383838] hover:bg-[#383838]'
                                                    : isDarkMode
                                                      ? 'bg-[#2c2c2e]/50 border-[#2c2c2e] hover:bg-[#3a3a3c]'
                                                      : 'bg-[#2a2a2a]/50 border-[#2a2a2a] hover:bg-[#383838]'
                                            }
                                        `}
                                    />
                                );
                            })}
                        </div>
                    ))}
                </div>
            </div>

            {/* Bottom Action Bar */}
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between pt-4 gap-4">
                {/* Left: Hotkeys - Hidden on mobile */}
                <div className={`hidden md:block text-xs font-medium transition-colors duration-300 ${
                  isDarkMode ? 'text-gray-500' : 'text-gray-400'
                }`}>
                  <span className={`font-bold px-1.5 py-0.5 rounded ${
                    isDarkMode ? 'text-gray-300 bg-gray-700' : 'text-gray-600 bg-gray-100'
                  }`}>SPACE</span> Play • <span className={`font-bold px-1.5 py-0.5 rounded ${
                    isDarkMode ? 'text-gray-300 bg-gray-700' : 'text-gray-600 bg-gray-100'
                  }`}>C</span> Clear
                </div>

                {/* Center: Play Button - Full width on mobile */}
                <div className="flex justify-center md:flex-1 w-full md:w-auto">
                  <button 
                      onClick={() => setIsPlaying(!isPlaying)}
                      className={`w-full md:w-14 h-14 md:h-14 rounded-xl md:rounded-full flex items-center justify-center transition-all active:scale-95 border-2 font-semibold ${
                          isPlaying 
                              ? isDarkMode
                                ? 'bg-red-500/20 border-red-500/50 text-red-400 hover:bg-red-500/30' 
                                : 'bg-red-50 border-red-200 text-red-600 hover:bg-red-100'
                              : isDarkMode
                                ? 'bg-blue-500/20 border-blue-500/50 text-blue-400 hover:bg-blue-500/30'
                                : 'bg-blue-50 border-blue-200 text-blue-600 hover:bg-blue-100'
                          }`}
                  >
                      {isPlaying ? (
                        <div className="flex items-center gap-2">
                          <Square size={20} fill="currentColor" />
                          <span className="text-sm uppercase tracking-wider md:hidden">Stop</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <Play size={22} fill="currentColor" className="ml-0.5" />
                          <span className="text-sm uppercase tracking-wider md:hidden">Play</span>
                        </div>
                      )}
                  </button>
                </div>

                {/* Right: Export Controls - Stack on mobile */}
                <div className={`flex flex-col md:flex-row items-stretch md:items-center gap-3 md:gap-4 px-4 py-3 rounded-xl border transition-colors ${
                  isDarkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-gray-50 border-gray-200'
                }`}>
                  {/* Loop Count */}
                  <div className="flex items-center justify-between md:justify-start gap-2">
                    <span className={`text-xs font-medium ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}>Loops:</span>
                    <div className="flex gap-1.5">
                      {[1, 2, 4, 8].map(count => (
                        <button
                          key={count}
                          onClick={() => setLoopCount(count)}
                          className={`w-9 h-8 rounded text-xs font-bold transition-all ${
                            loopCount === count
                              ? isDarkMode
                                ? 'bg-emerald-500 text-white'
                                : 'bg-emerald-600 text-white'
                              : isDarkMode
                                ? 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-300'
                          }`}
                        >
                          {count}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Divider - Hidden on mobile */}
                  <div className={`hidden md:block w-px h-8 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-300'}`}></div>

                  {/* Fade Toggles */}
                  <div className="flex items-center justify-between md:justify-start gap-3">
                    <label className={`flex items-center gap-1.5 cursor-pointer text-xs ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      <input
                        type="checkbox"
                        checked={fadeIn}
                        onChange={(e) => setFadeIn(e.target.checked)}
                        className="w-4 h-4 rounded accent-blue-500 cursor-pointer"
                      />
                      <span>Fade In</span>
                    </label>
                    <label className={`flex items-center gap-1.5 cursor-pointer text-xs ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      <input
                        type="checkbox"
                        checked={fadeOut}
                        onChange={(e) => setFadeOut(e.target.checked)}
                        className="w-4 h-4 rounded accent-blue-500 cursor-pointer"
                      />
                      <span>Fade Out</span>
                    </label>
                  </div>

                  {/* Divider - Hidden on mobile */}
                  <div className={`hidden md:block w-px h-8 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-300'}`}></div>

                  {/* Duration & Export */}
                  <div className="flex items-center justify-between gap-3">
                    <div className="text-left md:text-right">
                      <div className={`text-[10px] uppercase tracking-wide ${
                        isDarkMode ? 'text-gray-500' : 'text-gray-400'
                      }`}>Duration</div>
                      <div className={`text-sm font-mono font-bold ${
                        isDarkMode ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        {((60 / bpm) * (patternLength / 4) * loopCount).toFixed(1)}s
                      </div>
                    </div>
                    <button 
                      onClick={handleExport}
                      className={`flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg font-semibold transition-all active:scale-95 shadow-md text-sm flex-1 md:flex-initial ${
                        isDarkMode
                          ? 'bg-blue-600 text-white hover:bg-blue-500'
                          : 'bg-blue-600 text-white hover:bg-blue-700'
                      }`}
                    >
                      <span>Export</span>
                    </button>
                  </div>
                </div>
            </div>

        </div>
      </div>
    </div>
  );
}

export default function WarblePage() {
  return (
    <AIProjectPageWrapper>
      <WarbleApp />
    </AIProjectPageWrapper>
  );
}