/**
 * Audio engine for TypeRunner game
 * Procedural sound generation using Web Audio API
 */

class TypeRunnerAudioEngine {
  private ctx: AudioContext | null = null;
  private noteIndex: number = 0;
  private lastMoveWasDown: boolean = false;

  init(): void {
    if (!this.ctx) {
      const AudioContextClass =
        window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioContextClass();
    }
    this.resetNotes();
  }

  resetNotes(): void {
    this.noteIndex = 0;
    this.lastMoveWasDown = false;
  }

  private playTone(
    freq: number,
    type: OscillatorType = 'sine',
    duration: number = 0.1,
    vol: number = 0.1
  ): void {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
    gain.gain.setValueAtTime(vol, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(
      0.01,
      this.ctx.currentTime + duration
    );
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + duration);
  }

  playHit(): void {
    // Stochastic progression: 80% Up, 20% Down (if allowed)
    let change = 1;
    const canGoDown = this.noteIndex > 0 && !this.lastMoveWasDown;

    if (canGoDown && Math.random() < 0.2) {
      change = -1;
      this.lastMoveWasDown = true;
    } else {
      this.lastMoveWasDown = false;
    }

    this.noteIndex += change;

    // Happy Major Pentatonic Scale (C Major)
    // Intervals: Root, Maj2, Maj3, P5, Maj6
    const baseFreq = 261.63; // Middle C
    const intervals = [0, 2, 4, 7, 9];

    const octave = Math.floor(this.noteIndex / 5);
    const degree = this.noteIndex % 5;

    // Calculate semitone offset
    const semitone = octave * 12 + intervals[degree];
    // Frequency = Base * 2^(semitones/12)
    const freq = baseFreq * Math.pow(2, semitone / 12);

    // Main tone: Triangle (flute-like)
    this.playTone(freq, 'triangle', 0.12, 0.1);
    // Harmony: Sine (Perfect 5th above) - adds richness
    setTimeout(() => this.playTone(freq * 1.5, 'sine', 0.12, 0.03), 0);
  }

  playError(): void {
    // Soft "Thud" - Low frequency Sine wave
    this.playTone(150, 'sine', 0.15, 0.2);
    // Slight detune for feedback, but soft
    this.playTone(140, 'sine', 0.15, 0.1);
  }

  playLevelUp(): void {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    // Happy Major Triad Sweep (C -> E -> G -> C)
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(261.63, now); // C4
    osc.frequency.linearRampToValueAtTime(329.63, now + 0.1); // E4
    osc.frequency.linearRampToValueAtTime(392.0, now + 0.2); // G4
    osc.frequency.linearRampToValueAtTime(523.25, now + 0.4); // C5

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.linearRampToValueAtTime(0, now + 0.6);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(now + 0.6);
  }
}

// Export singleton instance
export const AudioEngine = new TypeRunnerAudioEngine();

