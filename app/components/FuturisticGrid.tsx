'use client';

import React, { useRef, useEffect, useState } from 'react';

interface Pulse {
  x: number;
  y: number;
  vertical: boolean;
  progress: number;
  speed: number;
  length: number;
  color: string;
  baseColor: string;
  interceptAmount: number;
  wasIntercepted: boolean;
  isPermanentlyGreen: boolean;
}

interface InterceptEffect {
  x: number;
  y: number;
  startTime: number;
  duration: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
}

/**
 * FuturisticGrid Component
 * Canvas-based grid with animated energy pulses
 * Professional cyberpunk aesthetic with electrical signal effects
 */
export default function FuturisticGrid({ 
  onPulseIntercepted 
}: { 
  onPulseIntercepted?: () => void 
} = {}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const noiseCanvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [reducedMotion, setReducedMotion] = useState(false);
  const animationFrameRef = useRef<number>();
  const noiseAnimationRef = useRef<number>();
  const pulsesRef = useRef<Pulse[]>([]);
  const interceptEffectsRef = useRef<InterceptEffect[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const mousePositionRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    // Check for reduced motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);
    
    const handleChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handleChange);
    
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Mouse tracking for 3D tilt
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1; // -1 to 1
      const y = (e.clientY / window.innerHeight) * 2 - 1; // -1 to 1
      mousePositionRef.current = { x, y };

      if (containerRef.current && !reducedMotion) {
        // Apply 3D tilt based on mouse position
        const tiltX = y * 2; // Tilt up/down
        const tiltY = x * -2; // Tilt left/right
        containerRef.current.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [reducedMotion]);

  // Animated noise texture
  useEffect(() => {
    if (reducedMotion) return;

    const noiseCanvas = noiseCanvasRef.current;
    if (!noiseCanvas) return;

    const noiseCtx = noiseCanvas.getContext('2d');
    if (!noiseCtx) return;

    const resizeNoiseCanvas = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = noiseCanvas.getBoundingClientRect();
      noiseCanvas.width = rect.width * dpr;
      noiseCanvas.height = rect.height * dpr;
      noiseCtx.scale(dpr, dpr);
      noiseCanvas.style.width = `${rect.width}px`;
      noiseCanvas.style.height = `${rect.height}px`;
    };

    resizeNoiseCanvas();
    window.addEventListener('resize', resizeNoiseCanvas);

    // Generate animated noise
    const animateNoise = () => {
      const rect = noiseCanvas.getBoundingClientRect();
      const imageData = noiseCtx.createImageData(rect.width, rect.height);
      const data = imageData.data;

      for (let i = 0; i < data.length; i += 4) {
        const noise = Math.random() * 255;
        data[i] = noise;     // R
        data[i + 1] = noise; // G
        data[i + 2] = noise; // B
        data[i + 3] = 15;    // A (low opacity for subtle effect)
      }

      noiseCtx.putImageData(imageData, 0, 0);
      noiseAnimationRef.current = requestAnimationFrame(animateNoise);
    };

    animateNoise();

    return () => {
      window.removeEventListener('resize', resizeNoiseCanvas);
      if (noiseAnimationRef.current) {
        cancelAnimationFrame(noiseAnimationRef.current);
      }
    };
  }, [reducedMotion]);

  useEffect(() => {
    if (reducedMotion) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Grid configuration
    const gridSize = 60; // Distance between grid lines
    const rect = canvas.getBoundingClientRect();
    const cols = Math.ceil(rect.width / gridSize);
    const rows = Math.ceil(rect.height / gridSize);

    // Colors
    const gridColor = 'rgba(59, 130, 246, 0.2)'; // Slightly more visible faded lines
    const majorGridColor = 'rgba(59, 130, 246, 0.25)'; // Slightly less visible major lines
    const pulseColors = ['#3B82F6', '#60A5FA', '#2563EB', '#EF4444']; // Blue palette with red accent

    // Initialize pulses
    const initializePulses = () => {
      const pulses: Pulse[] = [];
      const numPulses = 2; // Minimal number of simultaneous pulses
      const usedLines = new Set<string>();

      for (let i = 0; i < numPulses; i++) {
        const vertical = Math.random() > 0.5;
        const maxMajorLines = Math.floor((vertical ? cols : rows) / 3);
        
        // Find an unused line
        let majorLineIndex;
        let lineKey;
        let attempts = 0;
        
        do {
          majorLineIndex = Math.floor(Math.random() * maxMajorLines) * 3;
          lineKey = `${vertical ? 'v' : 'h'}-${majorLineIndex}`;
          attempts++;
        } while (usedLines.has(lineKey) && attempts < 50);
        
        if (attempts < 50) {
          usedLines.add(lineKey);
          
          // More varied speed range: 0.004 to 0.024
          const speed = 0.004 + Math.random() * 0.02;
          // Fast pulses (top 25%) are gold, others are random colors
          const isFast = speed > 0.018;
          const baseColor = isFast ? '#FFD700' : pulseColors[Math.floor(Math.random() * pulseColors.length)];
          
          pulses.push({
            x: vertical ? majorLineIndex * gridSize : 0,
            y: !vertical ? majorLineIndex * gridSize : 0,
            vertical,
            progress: Math.random(),
            speed: speed,
            length: 60 + Math.random() * 100,
            color: baseColor,
            baseColor: baseColor,
            interceptAmount: 0,
            wasIntercepted: false,
            isPermanentlyGreen: false,
          });
        }
      }

      pulsesRef.current = pulses;
    };

    initializePulses();

    // Draw grid
    const drawGrid = () => {
      ctx.strokeStyle = gridColor;
      ctx.lineWidth = 0.5;

      // Vertical lines
      for (let i = 0; i <= cols; i++) {
        const x = i * gridSize;
        const isMajor = i % 3 === 0;
        
        ctx.strokeStyle = isMajor ? majorGridColor : gridColor;
        ctx.lineWidth = isMajor ? 1 : 0.5;
        
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, rect.height);
        ctx.stroke();
      }

      // Horizontal lines
      for (let i = 0; i <= rows; i++) {
        const y = i * gridSize;
        const isMajor = i % 3 === 0;
        
        ctx.strokeStyle = isMajor ? majorGridColor : gridColor;
        ctx.lineWidth = isMajor ? 1 : 0.5;
        
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(rect.width, y);
        ctx.stroke();
      }
    };

    // Interpolate between two colors
    const interpolateColor = (color1: string, color2: string, amount: number) => {
      const hex1 = color1.replace('#', '');
      const hex2 = color2.replace('#', '');
      
      const r1 = parseInt(hex1.substring(0, 2), 16);
      const g1 = parseInt(hex1.substring(2, 4), 16);
      const b1 = parseInt(hex1.substring(4, 6), 16);
      
      const r2 = parseInt(hex2.substring(0, 2), 16);
      const g2 = parseInt(hex2.substring(2, 4), 16);
      const b2 = parseInt(hex2.substring(4, 6), 16);
      
      const r = Math.round(r1 + (r2 - r1) * amount);
      const g = Math.round(g1 + (g2 - g1) * amount);
      const b = Math.round(b1 + (b2 - b1) * amount);
      
      return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
    };

    // Check if cursor is near pulse
    const checkCursorProximity = (pulse: Pulse) => {
      // Convert normalized mouse position (-1 to 1) to canvas coordinates
      const mouseX = ((mousePositionRef.current.x + 1) / 2) * rect.width;
      const mouseY = ((mousePositionRef.current.y + 1) / 2) * rect.height;
      
      if (pulse.vertical) {
        const currentY = pulse.progress * rect.height;
        const distance = Math.sqrt(
          Math.pow(mouseX - pulse.x, 2) + 
          Math.pow(mouseY - currentY, 2)
        );
        return { 
          isClose: distance < 80, 
          x: pulse.x, 
          y: currentY 
        };
      } else {
        const currentX = pulse.progress * rect.width;
        const distance = Math.sqrt(
          Math.pow(mouseX - currentX, 2) + 
          Math.pow(mouseY - pulse.y, 2)
        );
        return { 
          isClose: distance < 80, 
          x: currentX, 
          y: pulse.y 
        };
      }
    };

    // Create particle burst on interception
    const createParticleBurst = (x: number, y: number) => {
      const particleCount = 12;
      for (let i = 0; i < particleCount; i++) {
        const angle = (Math.PI * 2 * i) / particleCount;
        const speed = 2 + Math.random() * 3;
        particlesRef.current.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 1,
          maxLife: 0.8 + Math.random() * 0.4,
          size: 3 + Math.random() * 4,
        });
      }
    };

    // Draw particles with blur
    const drawParticles = () => {
      particlesRef.current.forEach((particle) => {
        const alpha = particle.life;
        
        // Heavy blur for particle effect
        ctx.shadowBlur = 15 + particle.size * 2;
        ctx.shadowColor = '#22C55E';
        ctx.globalAlpha = alpha * 0.9;
        
        // Draw particle as glowing circle
        ctx.fillStyle = `rgba(34, 197, 94, ${alpha})`;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
        
        // Additional outer glow
        ctx.shadowBlur = 25;
        ctx.globalAlpha = alpha * 0.5;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size * 1.8, 0, Math.PI * 2);
        ctx.fill();
      });
      
      ctx.shadowBlur = 0;
      ctx.globalAlpha = 1;
    };

    // Update particles
    const updateParticles = () => {
      particlesRef.current = particlesRef.current.filter((particle) => {
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.vx *= 0.95; // Friction
        particle.vy *= 0.95;
        particle.life -= 0.02; // Fade out
        return particle.life > 0;
      });
    };

    // Draw pulse with enhanced bloom
    const drawPulse = (pulse: Pulse) => {
      const { x, y, vertical, progress, length, baseColor, isPermanentlyGreen } = pulse;
      
      // Use green if permanently intercepted, otherwise base color
      const successColor = '#22C55E'; // Green for success
      const color = isPermanentlyGreen ? successColor : baseColor;

      if (vertical) {
        const currentY = progress * rect.height;
        
        // Create gradient for pulse
        const gradient = ctx.createLinearGradient(x, currentY - length, x, currentY);
        gradient.addColorStop(0, 'transparent');
        gradient.addColorStop(0.5, color);
        gradient.addColorStop(1, 'transparent');

        // Draw bloom layers for stronger glow
        ctx.strokeStyle = gradient;
        
        // Outer bloom
        ctx.lineWidth = 8;
        ctx.shadowBlur = 25;
        ctx.shadowColor = color;
        ctx.globalAlpha = 0.3;
        ctx.beginPath();
        ctx.moveTo(x, Math.max(0, currentY - length));
        ctx.lineTo(x, Math.min(rect.height, currentY));
        ctx.stroke();

        // Middle bloom
        ctx.lineWidth = 5;
        ctx.shadowBlur = 20;
        ctx.globalAlpha = 0.5;
        ctx.beginPath();
        ctx.moveTo(x, Math.max(0, currentY - length));
        ctx.lineTo(x, Math.min(rect.height, currentY));
        ctx.stroke();

        // Core line
        ctx.lineWidth = 3;
        ctx.shadowBlur = 15;
        ctx.globalAlpha = 1.0;
        ctx.beginPath();
        ctx.moveTo(x, Math.max(0, currentY - length));
        ctx.lineTo(x, Math.min(rect.height, currentY));
        ctx.stroke();

        // Reset
        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1.0;
      } else {
        const currentX = progress * rect.width;
        
        // Create gradient for pulse
        const gradient = ctx.createLinearGradient(currentX - length, y, currentX, y);
        gradient.addColorStop(0, 'transparent');
        gradient.addColorStop(0.5, color);
        gradient.addColorStop(1, 'transparent');

        ctx.strokeStyle = gradient;
        
        // Outer bloom
        ctx.lineWidth = 8;
        ctx.shadowBlur = 25;
        ctx.shadowColor = color;
        ctx.globalAlpha = 0.3;
        ctx.beginPath();
        ctx.moveTo(Math.max(0, currentX - length), y);
        ctx.lineTo(Math.min(rect.width, currentX), y);
        ctx.stroke();

        // Middle bloom
        ctx.lineWidth = 5;
        ctx.shadowBlur = 20;
        ctx.globalAlpha = 0.5;
        ctx.beginPath();
        ctx.moveTo(Math.max(0, currentX - length), y);
        ctx.lineTo(Math.min(rect.width, currentX), y);
        ctx.stroke();

        // Core line
        ctx.lineWidth = 3;
        ctx.shadowBlur = 15;
        ctx.globalAlpha = 1.0;
        ctx.beginPath();
        ctx.moveTo(Math.max(0, currentX - length), y);
        ctx.lineTo(Math.min(rect.width, currentX), y);
        ctx.stroke();

        // Reset
        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1.0;
      }
    };

    // Animation loop
    const animate = () => {
      const currentTime = performance.now();
      ctx.clearRect(0, 0, rect.width, rect.height);

      // Draw static grid
      drawGrid();

      // Track which lines currently have pulses
      const activeLinesSet = new Set<string>();
      pulsesRef.current.forEach((pulse) => {
        if (pulse.progress >= 0 && pulse.progress <= 1.0) {
          const lineKey = `${pulse.vertical ? 'v' : 'h'}-${pulse.vertical ? pulse.x : pulse.y}`;
          activeLinesSet.add(lineKey);
        }
      });

      // Update and draw pulses
      pulsesRef.current.forEach((pulse, index) => {
        pulse.progress += pulse.speed;

        // Check for cursor interception
        const proximity = checkCursorProximity(pulse);
        const isIntercepted = proximity.isClose && pulse.progress >= 0 && pulse.progress <= 1.0;
        
        // Trigger effect on first interception and make permanently green
        if (isIntercepted && !pulse.wasIntercepted && !pulse.isPermanentlyGreen) {
          pulse.wasIntercepted = true;
          pulse.isPermanentlyGreen = true; // Stays green forever
          
          // Create particle burst effect
          createParticleBurst(proximity.x, proximity.y);
          
          // Notify parent of interception
          onPulseIntercepted?.();
        } else if (!isIntercepted) {
          pulse.wasIntercepted = false;
        }

        // Reset pulse when it reaches the end
        if (pulse.progress > 1.2) {
          const vertical = Math.random() > 0.5;
          const maxMajorLines = Math.floor((vertical ? cols : rows) / 3);
          
          // Find an unused line
          let majorLineIndex;
          let lineKey;
          let attempts = 0;
          
          do {
            majorLineIndex = Math.floor(Math.random() * maxMajorLines) * 3;
            lineKey = `${vertical ? 'v' : 'h'}-${majorLineIndex}`;
            attempts++;
          } while (activeLinesSet.has(lineKey) && attempts < 50);
          
          // More varied speed range: 0.004 to 0.024
          const speed = 0.004 + Math.random() * 0.02;
          // Fast pulses (top 25%) are gold, others are random colors
          const isFast = speed > 0.018;
          const baseColor = isFast ? '#FFD700' : pulseColors[Math.floor(Math.random() * pulseColors.length)];
          
          pulsesRef.current[index] = {
            x: vertical ? majorLineIndex * gridSize : 0,
            y: !vertical ? majorLineIndex * gridSize : 0,
            vertical,
            progress: -0.2,
            speed: speed,
            length: 60 + Math.random() * 100,
            color: baseColor,
            baseColor: baseColor,
            interceptAmount: 0,
            wasIntercepted: false,
            isPermanentlyGreen: false,
          };
        }

        drawPulse(pulse);
      });

      // Update and draw particles
      updateParticles();
      drawParticles();

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [reducedMotion]);

  // Static grid for reduced motion
  if (reducedMotion) {
    return (
      <div className="absolute inset-0 w-full h-full pointer-events-none">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="rgba(59, 130, 246, 0.2)" strokeWidth="0.5"/>
            </pattern>
            <pattern id="majorGrid" width="180" height="180" patternUnits="userSpaceOnUse">
              <path d="M 180 0 L 0 0 0 180" fill="none" stroke="rgba(59, 130, 246, 0.25)" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
          <rect width="100%" height="100%" fill="url(#majorGrid)" />
        </svg>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className="absolute inset-0 w-full h-full pointer-events-none transition-transform duration-200 ease-out"
      style={{ transformStyle: 'preserve-3d' }}
    >
      {/* Grid canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ background: 'transparent' }}
      />
      {/* Animated noise texture overlay */}
      <canvas
        ref={noiseCanvasRef}
        className="absolute inset-0 w-full h-full mix-blend-overlay opacity-40"
        style={{ background: 'transparent' }}
      />
    </div>
  );
}

