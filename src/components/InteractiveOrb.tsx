/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from 'react';
import { SimulationParams, NodeId } from '../types';
import { Play, Pause, RefreshCw, Sparkles, Orbit } from 'lucide-react';

interface InteractiveOrbProps {
  params: SimulationParams;
  setParams: React.Dispatch<React.SetStateAction<SimulationParams>>;
  activeNodeColor: string;
  activeNodeAccent: string;
  activeNodeId: NodeId;
  onControlChange: (param: keyof SimulationParams, value: number) => void;
  audioActive: boolean;
  frequency: number;
}

interface BubbleParticle {
  x: number;
  y: number; // relative to center
  z: number;
  radius: number;
  speedY: number;
  wobbleSpeed: number;
  wobbleAmount: number;
  opacity: number;
  colorType: 'violet' | 'cyan' | 'core';
  phase: number;
}

export const InteractiveOrb: React.FC<InteractiveOrbProps> = ({
  params,
  setParams,
  activeNodeColor,
  activeNodeAccent,
  activeNodeId,
  onControlChange,
  audioActive,
  frequency,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isRotating, setIsRotating] = useState(true);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0, isOver: false });
  const bubblesRef = useRef<BubbleParticle[]>([]);
  const rotationAngleRef = useRef(0);

  // Initialize bubbles inside the flask core
  const initBubbles = () => {
    const list: BubbleParticle[] = [];
    const count = 180; // High performance silky smooth 60fps
    
    for (let i = 0; i < count; i++) {
      // Confined roughly inside a cylinder/sphere representing the flask reservoir
      const angle = Math.random() * Math.PI * 2;
      const radiusFromCenter = Math.random() * 110;
      
      list.push({
        x: Math.cos(angle) * radiusFromCenter,
        y: (Math.random() - 0.5) * 220, // vertical span
        z: (Math.random() - 0.5) * 100,
        radius: 1.5 + Math.random() * 4.5,
        speedY: 0.4 + Math.random() * 1.2,
        wobbleSpeed: 0.02 + Math.random() * 0.05,
        wobbleAmount: 1.0 + Math.random() * 3.0,
        opacity: 0.15 + Math.random() * 0.6,
        colorType: Math.random() > 0.4 ? 'violet' : 'cyan',
        phase: Math.random() * Math.PI * 2,
      });
    }

    // Centered core cavitation bubbles
    for (let i = 0; i < 30; i++) {
      list.push({
        x: (Math.random() - 0.5) * 20,
        y: (Math.random() - 0.5) * 20,
        z: (Math.random() - 0.5) * 20,
        radius: 1.0 + Math.random() * 2.0,
        speedY: 0.1 + Math.random() * 0.3,
        wobbleSpeed: 0.1,
        wobbleAmount: 0.5,
        opacity: 0.8,
        colorType: 'core',
        phase: Math.random() * Math.PI * 2,
      });
    }

    bubblesRef.current = list;
  };

  useEffect(() => {
    initBubbles();
  }, []);

  // Handle Resize smoothly
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !containerRef.current) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        canvas.width = width * window.devicePixelRatio;
        canvas.height = height * window.devicePixelRatio;
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;
      }
    });

    resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, []);

  // Frame Loop
  useEffect(() => {
    let frameId: number;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const renderFrame = () => {
      const width = canvas.width;
      const height = canvas.height;
      
      // Clean background matching #0B0C10 vacuum
      ctx.fillStyle = `rgba(11, 12, 16, ${1 - (params.dissipation / 100)})`;
      ctx.fillRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;
      const baseRadius = Math.min(width, height) * 0.22;
      const focus = 400;

      // Update rotation or base clock
      rotationAngleRef.current += 0.01 * params.speed;

      // Draw glass flask outline in wireframe format
      ctx.strokeStyle = 'rgba(139, 92, 246, 0.18)';
      ctx.lineWidth = 1.5;
      
      // 1. Flask Neck (Top cylinder wireframe)
      const neckYTop = cy - 140;
      const neckYBottom = cy - 60;
      const neckRadius = 38;

      ctx.beginPath();
      ctx.ellipse(cx, neckYTop, neckRadius, 8, 0, 0, Math.PI * 2);
      ctx.ellipse(cx, neckYBottom, neckRadius, 8, 0, 0, Math.PI * 2);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(cx - neckRadius, neckYTop); ctx.lineTo(cx - neckRadius, neckYBottom);
      ctx.moveTo(cx + neckRadius, neckYTop); ctx.lineTo(cx + neckRadius, neckYBottom);
      ctx.stroke();

      // 2. Primary Spherical Flask Reservoir
      ctx.beginPath();
      ctx.arc(cx, cy + 20, 130, -Math.PI * 0.43, Math.PI * 1.43);
      ctx.strokeStyle = 'rgba(139, 92, 246, 0.25)';
      ctx.stroke();

      // Flat bottom of the flask for stability design
      ctx.beginPath();
      ctx.ellipse(cx, cy + 145, 50, 10, 0, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(15, 23, 42, 0.4)';
      ctx.fill();
      ctx.stroke();

      // Draw horizontal liquid/vacuum level line inside flask
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.12)';
      ctx.beginPath();
      ctx.ellipse(cx, cy - 10, 118, 12, 0, 0, Math.PI * 2);
      ctx.stroke();

      // Acoustic Pressure Wave grids surrounding the flask (representing physical fields)
      ctx.strokeStyle = 'rgba(139, 92, 246, 0.04)';
      ctx.lineWidth = 1;
      for (let rDelta = 1; rDelta <= 3; rDelta++) {
        ctx.beginPath();
        const excitationScale = 1 + Math.sin(Date.now() * 0.002) * 0.05 * rDelta;
        ctx.arc(cx, cy + 20, 130 + rDelta * 30 * excitationScale, 0, Math.PI * 2);
        ctx.stroke();
      }

      // 3. Central Sonoluminescent Hotspot (Glowing Violet Core Bubble)
      // Pulse expands on resonance slider metric
      const centralPulse = 1.0 + Math.sin(Date.now() * 0.006) * 0.14 + (params.resonance * 0.004);
      const coreSize = 14 * centralPulse;

      const innerGlow = ctx.createRadialGradient(cx, cy + 20, 1, cx, cy + 20, coreSize * 5);
      innerGlow.addColorStop(0, '#ffffff'); // pure hot core
      innerGlow.addColorStop(0.15, 'rgba(168, 85, 247, 0.95)'); // sharp violet boundary
      innerGlow.addColorStop(0.45, 'rgba(139, 92, 246, 0.35)'); // cosmic purple
      innerGlow.addColorStop(0.8, 'rgba(6, 182, 212, 0.06)'); // cyan outer ionization
      innerGlow.addColorStop(1, 'rgba(11, 12, 16, 0)');

      ctx.fillStyle = innerGlow;
      ctx.beginPath();
      ctx.arc(cx, cy + 20, coreSize * 6, 0, Math.PI * 2);
      ctx.fill();

      // Draw visual light emission rays simulating high temperature cavitation flash
      if (audioActive || Math.random() > 0.94) {
        const rayCount = 8 + Math.floor(params.excitation / 2);
        ctx.strokeStyle = 'rgba(168, 85, 247, 0.3)';
        ctx.lineWidth = 1;
        const baseLength = 70 + params.resonance * 1.5;
        
        for (let rAngle = 0; rAngle < rayCount; rAngle++) {
          const currentRad = (rAngle / rayCount) * Math.PI * 2 + (Date.now() * 0.0003);
          const flashWobble = 1 + Math.sin(Date.now() * 0.02 + rAngle) * 0.15;
          const endX = cx + Math.cos(currentRad) * baseLength * flashWobble;
          const endY = cy + 20 + Math.sin(currentRad) * baseLength * flashWobble;
          
          ctx.beginPath();
          ctx.moveTo(cx, cy + 20);
          ctx.lineTo(endX, endY);
          ctx.stroke();
        }
      }

      // Update and Render Floating Vacuum Bubbles
      const sortedBubbles = [...bubblesRef.current]
        .map((b) => {
          // Bubble moves up
          if (isRotating) {
            b.y -= b.speedY * params.speed;
          }

          // Wrap back around if bubbles float out of the flask reservoir window
          if (b.y < -120) {
            b.y = 120 + Math.random() * 40;
            b.x = (Math.random() - 0.5) * 160;
          }

          // Apply sideways wobble simulating fluid currents
          const localWobble = Math.sin(rotationAngleRef.current * b.wobbleSpeed + b.phase) * b.wobbleAmount;
          let bx = b.x + localWobble;
          let by = b.y + 20; // adjust offset

          // Mouse Graviton Magnetic Attraction Pull
          if (mousePos.isOver && params.graviton > 0) {
            const dx = (mousePos.x * window.devicePixelRatio) - cx;
            const dy = (mousePos.y * window.devicePixelRatio) - by;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 200 && distance > 5) {
              const attractionFactor = (params.graviton / 100) * (1 - distance / 200) * 2.0;
              bx += dx * attractionFactor;
              by += dy * attractionFactor;
            }
          }

          // 3D perspective mapping
          const cosPitch = Math.cos(0.2); // slight permanent camera tilt
          const zRot = b.z;
          const scale = focus / (focus + zRot);

          return {
            projX: cx + bx * scale,
            projY: cy + by * scale,
            depth: zRot,
            radius: b.radius * scale,
            opacity: b.opacity,
            colorType: b.colorType,
          };
        })
        .sort((a, b) => b.depth - a.depth); // back-to-front rendering

      // Paint bubbles
      sortedBubbles.forEach((b) => {
        if (b.radius <= 0) return;
        
        ctx.beginPath();
        ctx.arc(b.projX, b.projY, b.radius, 0, Math.PI * 2);

        const alphaScalar = Math.min(1, Math.max(0.1, (b.depth + 100) / 200));
        const bubbleAlpha = b.opacity * alphaScalar;

        if (b.colorType === 'violet') {
          // Hollow glass capsule vibe (violet sphere gradient)
          const radGrad = ctx.createRadialGradient(
            b.projX - b.radius * 0.3,
            b.projY - b.radius * 0.3,
            0.1,
            b.projX,
            b.projY,
            b.radius
          );
          radGrad.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
          radGrad.addColorStop(0.3, 'rgba(168, 85, 247, 0.35)');
          radGrad.addColorStop(1, 'rgba(139, 92, 246, 0.05)');
          ctx.fillStyle = radGrad;
          ctx.fill();

          // Delicate outline
          ctx.strokeStyle = `rgba(168, 85, 247, ${bubbleAlpha * 0.75})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();

        } else if (b.colorType === 'cyan') {
          // Ionized Cyan vacuum bubble
          const radGrad = ctx.createRadialGradient(
            b.projX - b.radius * 0.3,
            b.projY - b.radius * 0.3,
            0.1,
            b.projX,
            b.projY,
            b.radius
          );
          radGrad.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
          radGrad.addColorStop(0.4, 'rgba(6, 182, 212, 0.4)');
          radGrad.addColorStop(1, 'rgba(8, 145, 178, 0.05)');
          ctx.fillStyle = radGrad;
          ctx.fill();

          ctx.strokeStyle = `rgba(6, 182, 212, ${bubbleAlpha * 0.85})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();

        } else {
          // core particles getting sucked into center singularity
          ctx.fillStyle = `rgba(255, 255, 255, ${bubbleAlpha * 0.95})`;
          ctx.fill();
        }
      });

      // Quick visualizer grid boundary
      if (audioActive) {
        ctx.strokeStyle = 'rgba(168, 85, 247, 0.15)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        const segments = 60;
        for (let i = 0; i <= segments; i++) {
          const angle = (i / segments) * Math.PI * 2 + (Date.now() * 0.002);
          const scaleOffset = 1.0 + Math.sin(angle * 12 + Date.now() * 0.02) * 0.04 * (params.resonance / 35);
          const rx = cx + Math.cos(angle) * 130 * scaleOffset;
          const ry = cy + 20 + Math.sin(angle) * 130 * scaleOffset;
          if (i === 0) ctx.moveTo(rx, ry);
          else ctx.lineTo(rx, ry);
        }
        ctx.stroke();
      }

      frameId = requestAnimationFrame(renderFrame);
    };

    renderFrame();

    return () => cancelAnimationFrame(frameId);
  }, [params, activeNodeColor, activeNodeAccent, isRotating, mousePos, audioActive]);

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      isOver: true,
    });
  };

  return (
    <div className="flex flex-col h-full bg-[#0b0c10] backdrop-blur-md rounded-2xl border border-purple-950/40 overflow-hidden shadow-2xl relative group">
      {/* Decorative Scientific Graticules */}
      <div className="absolute top-0 left-0 w-full p-4 flex justify-between items-center bg-gradient-to-b from-[#0b0c10]/95 to-transparent z-10 pointer-events-none">
        <div>
          <span className="font-mono text-[9px] tracking-[0.25em] text-purple-400 font-bold block">
            FLASK RESONANCE SINGULARITY
          </span>
          <h2 className="text-sm font-display font-medium text-slate-100 flex items-center gap-1.5 mt-0.5">
            <Orbit className="w-3.5 h-3.5 text-purple-400 rotate-12 group-hover:rotate-45 transition-transform duration-700" />
            Vacuum Cavitation Core
          </h2>
        </div>
        <div className="flex flex-col items-end font-mono">
          <span className="text-[10px] text-slate-400">STATUS: INTERFERENCE</span>
          <span className="text-[9px] text-emerald-400 flex items-center gap-1 animate-pulse font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-450"></span>
            ACTIVE EMISSION
          </span>
        </div>
      </div>

      {/* Main Responsive Canvas Slot */}
      <div 
        ref={containerRef} 
        className="flex-1 min-h-[360px] relative cursor-crosshair overflow-hidden"
      >
        <canvas
          id="orbital-resonance-canvas"
          ref={canvasRef}
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setMousePos(prev => ({ ...prev, isOver: true }))}
          onMouseLeave={() => setMousePos(prev => ({ ...prev, isOver: false }))}
          className="w-full h-full block"
        />

        {/* Ambient Center Overlay overlay HUD stats */}
        <div className="absolute bottom-4 left-4 z-10 pointer-events-none font-mono text-[10px] text-slate-400/95 bg-[#0b0c10]/90 border border-purple-950/45 p-2.5 rounded-lg max-w-[190px] backdrop-blur-md">
          <p className="font-semibold text-slate-200 border-b border-purple-950/60 pb-1 mb-1">CO CAVITATION FLASK</p>
          <div className="flex justify-between mt-0.5 gap-2">
            <span>BUBBLE SPEEDY:</span>
            <span className="text-slate-100 font-bold">{(params.speed * 1.5).toFixed(2)} m/s</span>
          </div>
          <div className="flex justify-between mt-0.5 gap-2">
            <span>FLUX COLLAPSE:</span>
            <span className="text-slate-100 font-bold">{(params.excitation * 120).toFixed(0)} K</span>
          </div>
          <div className="flex justify-between mt-0.5 gap-2">
            <span>FREQUENCY:</span>
            <span className="text-slate-100 font-bold">{frequency} Hz</span>
          </div>
        </div>

        {/* Floating Quick Action Overlay */}
        <div className="absolute bottom-4 right-4 z-20 flex gap-2">
          <button
            id="toggle-rotation-btn"
            onClick={() => setIsRotating(!isRotating)}
            className="p-2.5 rounded-lg bg-slate-950/90 border border-purple-900/40 text-slate-300 hover:text-white hover:bg-slate-900/90 transition duration-150 shadow-md backdrop-blur-sm"
            title={isRotating ? "Pause Bubble Rise" : "Resume Bubble Rise"}
          >
            {isRotating ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>
          
          <button
            id="reset-particles-btn"
            onClick={initBubbles}
            className="p-2.5 rounded-lg bg-slate-950/90 border border-purple-900/40 text-slate-300 hover:text-white hover:bg-slate-900/90 transition duration-150 shadow-md backdrop-blur-sm"
            title="Shatter/Reset"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Volumetric controls footer */}
      <div className="p-5 border-t border-purple-950/40 bg-[#08080c] grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Row 1 - Speed */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center text-xs">
            <label htmlFor="input-speed" className="text-slate-450 font-medium flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-cyan-400" />
              Ascent Float Speed
            </label>
            <span className="font-mono text-[11px] text-cyan-300 bg-[#0c1221] px-1.5 py-0.5 rounded border border-cyan-900/30 font-bold">
              {params.speed.toFixed(1)}x
            </span>
          </div>
          <input
            id="input-speed"
            type="range"
            min="0.1"
            max="3.0"
            step="0.1"
            value={params.speed}
            onChange={(e) => onControlChange('speed', parseFloat(e.target.value))}
            className="w-full h-1 bg-slate-800 rounded-lg cursor-pointer appearance-none accent-cyan-400"
          />
        </div>

        {/* Row 2 - Excitation */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center text-xs">
            <label htmlFor="input-excitation" className="text-slate-450 font-medium flex items-center gap-1">
              <Orbit className="w-3.5 h-3.5 text-purple-400" />
              Cavitation Excitation
            </label>
            <span className="font-mono text-[11px] text-purple-300 bg-[#120c21] px-1.5 py-0.5 rounded border border-purple-900/30 font-bold">
              {params.excitation.toFixed(0)} peaks
            </span>
          </div>
          <input
            id="input-excitation"
            type="range"
            min="2"
            max="16"
            step="1"
            value={params.excitation}
            onChange={(e) => onControlChange('excitation', parseInt(e.target.value))}
            className="w-full h-1 bg-slate-800 rounded-lg cursor-pointer appearance-none accent-purple-400"
          />
        </div>

        {/* Row 3 - Resonance */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-450 font-medium flex items-center gap-1">
              <div className="w-2 h-2 rounded-full animate-ping bg-purple-500"></div>
              Acoustic Resonance
            </span>
            <span className="font-mono text-[11px] text-purple-300 bg-slate-950 px-1.5 py-0.5 rounded border border-purple-950 font-bold">
              {params.resonance.toFixed(0)}%
            </span>
          </div>
          <input
            id="input-resonance"
            type="range"
            min="0"
            max="100"
            step="5"
            value={params.resonance}
            onChange={(e) => onControlChange('resonance', parseInt(e.target.value))}
            className="w-full h-1 bg-slate-800 rounded-lg cursor-pointer appearance-none accent-purple-500"
          />
        </div>

        {/* Row 4 - Magnetism */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-450 font-medium flex items-center gap-1">
              <span className="font-bold relative -top-0.5">🧲</span> Vacuum Graviton
            </span>
            <span className="font-mono text-[11px] text-cyan-300 bg-slate-950 px-1.5 py-0.5 rounded border border-purple-950 font-bold animate-pulse">
              {params.graviton}%
            </span>
          </div>
          <input
            id="input-graviton"
            type="range"
            min="0"
            max="100"
            step="5"
            value={params.graviton}
            onChange={(e) => onControlChange('graviton', parseInt(e.target.value))}
            className="w-full h-1 bg-slate-800 rounded-lg cursor-pointer appearance-none accent-cyan-450"
          />
        </div>
      </div>
    </div>
  );
};
