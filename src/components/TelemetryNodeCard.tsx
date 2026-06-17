/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef } from 'react';
import { TelemetryNode } from '../types';
import { Activity, ShieldAlert, Cpu, Radio, CircleDot } from 'lucide-react';

interface TelemetryNodeCardProps {
  node: TelemetryNode;
  isActive: boolean;
  onSelect: (nodeId: string) => void;
  speedMultiplier: number;
  excitation: number;
}

export const TelemetryNodeCard: React.FC<TelemetryNodeCardProps> = ({
  node,
  isActive,
  onSelect,
  speedMultiplier,
  excitation,
}) => {
  const localCanvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = localCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animFrame: number;
    let time = 0;

    const render = () => {
      // Dynamic clearing to support slight trace trails
      ctx.fillStyle = 'rgba(10, 11, 22, 0.18)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const w = canvas.width;
      const h = canvas.height;
      const cx = w / 2;
      const cy = h / 2;
      time += 0.02 * speedMultiplier;

      if (node.id === 'sol-alpha') {
        // SOLAR ANALEMMA - Figure-8 solar trajectory trace
        ctx.strokeStyle = `${node.color}50`;
        ctx.lineWidth = 1.0;
        ctx.beginPath();
        
        // Draw complete background dotted figure-8 shape
        for (let t = 0; t <= Math.PI * 2; t += 0.05) {
          // Standard Analemma math approximation
          const ax = cx + Math.sin(t) * (w * 0.36);
          const ay = cy + Math.sin(2 * t) * (h * 0.28);
          if (t === 0) ctx.moveTo(ax, ay);
          else ctx.lineTo(ax, ay);
        }
        ctx.stroke();

        // Active solar tracker coordinate moving over the figure-8
        const dotX = cx + Math.sin(time * 0.5) * (w * 0.36);
        const dotY = cy + Math.sin(2 * (time * 0.5)) * (h * 0.28);

        // Grid lock hairs
        ctx.strokeStyle = 'rgba(239, 68, 68, 0.12)';
        ctx.beginPath();
        ctx.moveTo(dotX, 0); ctx.lineTo(dotX, h);
        ctx.moveTo(0, dotY); ctx.lineTo(w, dotY);
        ctx.stroke();

        // Core tracker orb
        ctx.beginPath();
        ctx.arc(dotX, dotY, 4, 0, Math.PI * 2);
        ctx.fillStyle = node.color;
        ctx.fill();

        // Glowing outer particle bloom
        ctx.beginPath();
        ctx.arc(dotX, dotY, 9, 0, Math.PI * 2);
        ctx.fillStyle = `${node.color}35`;
        ctx.fill();

      } else if (node.id === 'nadir-beta') {
        // NADIR MAGNETICS - Interconnected network nodes pulsing
        ctx.strokeStyle = `${node.color}15`;
        ctx.lineWidth = 1;

        const nodeCount = 6;
        const points: { x: number; y: number }[] = [];

        // Distribute points in a circle and oscillate them
        for (let i = 0; i < nodeCount; i++) {
          const angle = (i / nodeCount) * Math.PI * 2 + (time * 0.2);
          const radius = (w * 0.28) + Math.sin(time + i) * 6;
          points.push({
            x: cx + Math.cos(angle) * radius,
            y: cy + Math.sin(angle) * radius,
          });
        }

        // Draw connecting web lines
        ctx.beginPath();
        for (let i = 0; i < points.length; i++) {
          for (let j = i + 1; j < points.length; j++) {
            ctx.moveTo(points[i].x, points[i].y);
            ctx.lineTo(points[j].x, points[j].y);
          }
        }
        ctx.stroke();

        // Center primary magnetic vortex ring
        ctx.strokeStyle = `${node.color}40`;
        ctx.beginPath();
        ctx.arc(cx, cy, (w * 0.18) + Math.sin(time * 2) * 4, 0, Math.PI * 2);
        ctx.stroke();

        // Draw tiny orbiting nodes with glow
        points.forEach((p, idx) => {
          ctx.beginPath();
          ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
          ctx.fillStyle = idx % 2 === 0 ? node.color : node.accentColor;
          ctx.fill();
        });

      } else if (node.id === 'lumina-gamma') {
        // EM PACKET WAVE SPECTRUM - Rolling packet graph
        const waveSlices = 20;
        const gap = w / waveSlices;
        
        ctx.strokeStyle = `${node.color}60`;
        ctx.lineWidth = 1.5;
        ctx.beginPath();

        for (let i = 0; i <= waveSlices; i++) {
          const posX = i * gap;
          // Mathematical sound modulation simulation
          const waveHeight = Math.sin(i * 0.5 - time * 1.5) * Math.cos(time * 0.3) * (h * 0.25 * (excitation / 6));
          const posY = cy + waveHeight;

          if (i === 0) ctx.moveTo(posX, posY);
          else ctx.lineTo(posX, posY);

          // Draw vertical frequency power lines
          ctx.fillStyle = `${node.color}15`;
          ctx.fillRect(posX - 1, Math.min(posY, cy), 2, Math.abs(waveHeight));
        }
        ctx.stroke();

        // Base horizontal threshold
        ctx.strokeStyle = 'rgba(139, 92, 246, 0.15)';
        ctx.beginPath();
        ctx.moveTo(0, cy); ctx.lineTo(w, cy);
        ctx.stroke();

        // Signal flare beacon
        const packetX = cx + Math.sin(time) * (w * 0.3);
        const packetY = cy + Math.sin(packetX * 0.1 + time) * (h * 0.18);
        ctx.beginPath();
        ctx.arc(packetX, packetY, 3.5, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.fill();
        ctx.beginPath();
        ctx.arc(packetX, packetY, 7, 0, Math.PI * 2);
        ctx.fillStyle = `${node.color}60`;
        ctx.fill();
      }

      animFrame = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animFrame);
  }, [node.id, speedMultiplier, excitation]);

  // Handle live random state metrics to make cards feel alive
  const getRandomizedMetric = () => {
    const cycle = Date.now() * 0.001;
    if (node.id === 'sol-alpha') {
      // Celestial Altitude simulation
      const baseAlt = 34.12;
      return (baseAlt + Math.sin(cycle * 0.1) * 12.4).toFixed(3);
    } else if (node.id === 'nadir-beta') {
      // Core Geomagnetics in microTelstra
      const baseMag = 47.902;
      return (baseMag + Math.cos(cycle * 0.15) * 1.05).toFixed(3);
    } else {
      // Wave packet photon multiplier
      const basePacketNum = 1.042;
      return (basePacketNum + Math.sin(cycle * 0.45) * 0.18 + Math.cos(cycle * 0.9) * 0.05).toFixed(4);
    }
  };

  return (
    <div
      id={`telemetry-node-${node.id}`}
      onClick={() => onSelect(node.id)}
      className={`rounded-xl border p-4 transition-all duration-300 cursor-pointer flex flex-col justify-between h-[250px] relative overflow-hidden bg-slate-950/60 backdrop-blur-md group select-none ${
        isActive
          ? 'border-slate-300 shadow-xl scale-[1.02] bg-gradient-to-br from-slate-950/90 to-slate-900/60'
          : 'border-slate-800 hover:border-slate-700/80 hover:bg-slate-950/80'
      }`}
    >
      {/* Dynamic Colored Glow Overlay on Card Headers */}
      <div 
        className="absolute top-0 left-0 w-full h-[3px] opacity-70 transition duration-300"
        style={{
          background: isActive 
            ? `linear-gradient(90deg, ${node.color}, ${node.accentColor})` 
            : 'transparent'
        }}
      />

      {/* Card Header metadata */}
      <div className="flex justify-between items-start z-10">
        <div>
          <span className="font-mono text-[9px] tracking-[0.2em] uppercase opacity-60 block">
            {node.codename}
          </span>
          <h3 className="text-sm font-display font-semibold text-slate-100 mt-0.5 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: node.color }} />
            {node.name}
          </h3>
        </div>
        
        {/* Status indicator pill */}
        <span 
          className={`font-mono text-[9px] px-1.5 py-0.5 rounded border ${
            isActive 
              ? 'bg-slate-900 text-white font-bold' 
              : 'bg-slate-950 text-slate-400 border-slate-900'
          }`}
          style={{ borderColor: isActive ? `${node.color}40` : undefined }}
        >
          {node.status}
        </span>
      </div>

      {/* Visual Canvas Sub-Plot */}
      <div className="my-3 flex-1 h-[90px] relative rounded bg-slate-950/80 border border-slate-900 overflow-hidden">
        <canvas
          ref={localCanvasRef}
          width={280}
          height={90}
          className="w-full h-full block"
        />
        <div className="absolute right-2 bottom-1.5 font-mono text-[7.5px] text-slate-500/80 pointer-events-none uppercase">
          TELEMETRY PLOT_X44
        </div>
      </div>

      {/* Footer live feedback counts */}
      <div className="flex justify-between items-end z-10">
        <div className="font-mono">
          <span className="text-[9px] text-slate-450 block uppercase tracking-wider">{node.metricLabel}</span>
          <span className="text-sm font-bold text-slate-100 tabular-nums">
            {getRandomizedMetric()} <span className="text-[10px] font-normal text-slate-400">{node.metricUnit}</span>
          </span>
        </div>

        <div className="flex items-center gap-1 bg-slate-900/60 p-1 rounded border border-slate-800/40 text-[9.5px] font-mono text-slate-300">
          <Radio className="w-3 h-3 animate-pulse" style={{ color: node.color }} />
          <span>{node.frequency} Hz</span>
        </div>
      </div>

      {/* Selection background visual ring bloom */}
      {isActive && (
        <div 
          className="absolute -right-16 -bottom-16 w-36 h-36 rounded-full mix-blend-screen filter blur-3xl opacity-20 pointer-events-none transition duration-500"
          style={{ backgroundColor: node.color }}
        />
      )}
    </div>
  );
};
