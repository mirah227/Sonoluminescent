import React, { useEffect, useRef, useState } from 'react';

export const CavitationAnimation: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [phaseText, setPhaseText] = useState<'EXPANSION' | 'COMPRESSION' | 'COLLAPSE' | 'FLASH'>('EXPANSION');
  const [radiusMetric, setRadiusMetric] = useState<number>(10); // μm
  const [temperatureMetric, setTemperatureMetric] = useState<number>(300); // K

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let time = 0;

    const render = () => {
      time += 0.035;
      const width = canvas.width;
      const height = canvas.height;
      const cx = width / 2;
      const cy = height / 2;

      // Draw dark background matching #0B0C10
      ctx.fillStyle = '#0B0C10';
      ctx.fillRect(0, 0, width, height);

      // Draw custom subtle background grid values
      ctx.strokeStyle = '#1e1b4b'; // dark violet grid
      ctx.lineWidth = 0.5;
      for (let i = 20; i < width; i += 40) {
        ctx.beginPath();
        ctx.moveTo(i, 0); ctx.lineTo(i, height);
        ctx.stroke();
      }
      for (let i = 20; i < height; i += 40) {
        ctx.beginPath();
        ctx.moveTo(0, i); ctx.lineTo(width, i);
        ctx.stroke();
      }

      // Math for the bubble lifecycle (cavitation cycle)
      // We want expansion phase, rapid compression phase, violent collapse + light emission, then rebound/idle
      const cycleLength = (2 * Math.PI);
      const relativeTime = time % cycleLength;

      let bubbleRadius = 15;
      let flashIntensity = 0;
      let pressureState: 'EXPANSION' | 'COMPRESSION' | 'COLLAPSE' | 'FLASH' = 'EXPANSION';
      let currentTemp = 300; // Kelvin

      // Define standard phases based on sine projection:
      if (relativeTime < Math.PI) {
        // Slow Expansion Phase: Bubble grows from minimum to maximum
        const progress = relativeTime / Math.PI;
        bubbleRadius = 12 + Math.sin(progress * Math.PI / 2) * 58;
        pressureState = 'EXPANSION';
        currentTemp = Math.floor(300 - (bubbleRadius - 12) * 2); // adiabatic cooling
      } else if (relativeTime < Math.PI * 1.6) {
        // Rapid Compression Phase: Acoustic wave crushes the bubble
        const progress = (relativeTime - Math.PI) / (Math.PI * 0.6);
        bubbleRadius = 70 - progress * 62;
        pressureState = 'COMPRESSION';
        currentTemp = Math.floor(250 + progress * 4000); // adiabatic heating
      } else if (relativeTime < Math.PI * 1.75) {
        // Violent Collapse! Bubbles reach sub-micron scale
        bubbleRadius = 1.8;
        pressureState = 'COLLAPSE';
        currentTemp = 18500; // hyper temperature peak
      } else if (relativeTime < Math.PI * 1.9) {
        // Flash state! The energy is emitted as light
        const progress = (relativeTime - Math.PI * 1.75) / (Math.PI * 0.15);
        bubbleRadius = 2.0 + progress * 6.0; // small rebound
        flashIntensity = 1.0 - progress; // decaying visual lightning
        pressureState = 'FLASH';
        currentTemp = Math.floor(18500 * (1.0 - progress));
      } else {
        // Rebound stabilization
        const progress = (relativeTime - Math.PI * 1.9) / (Math.PI * 0.1);
        bubbleRadius = 8.0 - progress * 4.0;
        pressureState = 'EXPANSION';
        currentTemp = 300;
      }

      // Render ultrasonic acoustic wave fronts (expanding/contracting circles compressing the center)
      const waveCount = 3;
      ctx.lineWidth = 1;
      for (let w = 0; w < waveCount; w++) {
        const waveProgress = (time * 0.8 + w / waveCount) % 1;
        const waveRadius = 160 * (1 - waveProgress) + bubbleRadius * 0.2;
        
        if (waveRadius > bubbleRadius) {
          ctx.strokeStyle = `rgba(139, 92, 246, ${0.12 * waveProgress})`;
          ctx.beginPath();
          ctx.arc(cx, cy, waveRadius, 0, Math.PI * 2);
          ctx.stroke();
        }
      }

      // Render the primary bubble
      if (pressureState !== 'FLASH') {
        const bubbleGlow = ctx.createRadialGradient(cx, cy, bubbleRadius * 0.1, cx, cy, bubbleRadius);
        
        if (pressureState === 'COMPRESSION') {
          bubbleGlow.addColorStop(0, '#ffffff');
          bubbleGlow.addColorStop(0.3, 'rgba(6, 182, 212, 0.8)'); // cyan hot gas
          bubbleGlow.addColorStop(1, 'rgba(139, 92, 246, 0.15)');
          ctx.strokeStyle = 'rgba(6, 182, 212, 0.8)';
        } else {
          bubbleGlow.addColorStop(0, 'rgba(255, 255, 255, 0.4)');
          bubbleGlow.addColorStop(0.6, 'rgba(139, 92, 246, 0.25)'); // deep violet sphere
          bubbleGlow.addColorStop(1, 'rgba(6, 182, 212, 0.05)');
          ctx.strokeStyle = 'rgba(139, 92, 246, 0.4)';
        }

        ctx.fillStyle = bubbleGlow;
        ctx.beginPath();
        ctx.arc(cx, cy, bubbleRadius, 0, Math.PI * 2);
        ctx.fill();
        ctx.lineWidth = 1;
        ctx.stroke();

        // Little dynamic reflection glare dot on upper left
        if (bubbleRadius > 10) {
          ctx.fillStyle = 'rgba(255, 255, 255, 0.55)';
          ctx.beginPath();
          ctx.arc(cx - bubbleRadius * 0.35, cy - bubbleRadius * 0.35, bubbleRadius * 0.12, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Render Sonoluminescent Light Emission Flash (The climax of collapse!)
      if (flashIntensity > 0) {
        // High intensity radial light bloom
        const flashRadius = 115 * flashIntensity;
        const flashGlow = ctx.createRadialGradient(cx, cy, 1, cx, cy, flashRadius);
        flashGlow.addColorStop(0, '#ffffff');
        flashGlow.addColorStop(0.12, 'rgba(168, 85, 247, 1)'); // sharp violet
        flashGlow.addColorStop(0.4, 'rgba(6, 182, 212, 0.45)');  // neon cyan ionized sheath
        flashGlow.addColorStop(1, 'rgba(139, 92, 246, 0)');
        
        ctx.fillStyle = flashGlow;
        ctx.beginPath();
        ctx.arc(cx, cy, flashRadius, 0, Math.PI * 2);
        ctx.fill();

        // Simulated beam rays shooting outward during flash
        const beams = 12;
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
        for (let b = 0; b < beams; b++) {
          const angle = (b / beams) * Math.PI * 2 + (time * 0.2);
          const rayLen = (110 + Math.random() * 40) * flashIntensity;
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.moveTo(cx, cy);
          ctx.lineTo(cx + Math.cos(angle) * rayLen, cy + Math.sin(angle) * rayLen);
          ctx.stroke();
        }
      }

      // Update state metrics periodically
      setPhaseText(pressureState);
      setRadiusMetric(Math.round(bubbleRadius * 10) / 10);
      setTemperatureMetric(currentTemp);

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <div className="bg-[#0b0c10] border border-purple-950/40 rounded-2xl overflow-hidden relative shadow-2xl flex flex-col items-center">
      {/* Target Crosshairs styling */}
      <div className="absolute top-3 left-4 flex items-center gap-1.5 font-mono text-[9px] text-purple-400 font-bold z-10 pointer-events-none">
        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
        <span>HIGH-SPEED CAVITATION LAB CAMERA // RECT_02</span>
      </div>

      <div className="absolute top-3 right-4 font-mono text-[9px] text-slate-500 z-10 pointer-events-none">
        ZOOM: 250,000X
      </div>

      <div className="w-full relative h-[280px] flex items-center justify-center bg-[#07070a]/90">
        <canvas
          ref={canvasRef}
          width={360}
          height={280}
          className="w-full h-full block"
        />

        {/* Optical Center Scope Reticle */}
        <div className="absolute inset-0 border border-purple-950/10 pointer-events-none flex items-center justify-center">
          <div className="w-40 h-40 border border-purple-950/20 rounded-full border-dashed" />
          <div className="absolute w-8 h-[1px] bg-cyan-500/30" />
          <div className="absolute h-8 w-[1px] bg-cyan-500/30" />
        </div>
      </div>

      {/* Physics Stats bottom console strip */}
      <div className="w-full bg-[#08080c] border-t border-purple-950/30 p-4 grid grid-cols-3 gap-3 text-center font-mono">
        <div className="space-y-0.5">
          <span className="text-[8px] text-slate-500 uppercase font-black block leading-none">CELL DIAMETER</span>
          <span className="text-xs font-bold text-cyan-300">
            {radiusMetric > 0 ? (radiusMetric * 2).toFixed(1) : '< 0.5'} μm
          </span>
        </div>
        <div className="space-y-0.5 border-l border-purple-950/25">
          <span className="text-[8px] text-slate-500 uppercase font-black block leading-none">VESSEL THERMAL</span>
          <span className={`text-xs font-bold transition-all duration-100 ${temperatureMetric > 10000 ? 'text-rose-450 font-black animate-pulse' : 'text-purple-300'}`}>
            {temperatureMetric.toLocaleString()} K
          </span>
        </div>
        <div className="space-y-0.5 border-l border-purple-950/25">
          <span className="text-[8px] text-slate-500 uppercase font-black block leading-none">PRESSURE STATE</span>
          <span className={`text-[10px] font-black block tracking-wider ${
            phaseText === 'FLASH' ? 'text-white bg-purple-950/80 px-1 rounded animate-pulse' :
            phaseText === 'COLLAPSE' ? 'text-purple-400 font-extrabold' :
            phaseText === 'COMPRESSION' ? 'text-cyan-400' : 'text-slate-400'
          }`}>
            {phaseText}
          </span>
        </div>
      </div>
    </div>
  );
};
