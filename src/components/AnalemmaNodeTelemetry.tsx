import React, { useState, useEffect, useRef } from 'react';
import { 
  Activity, 
  Zap, 
  Settings, 
  Play, 
  Pause, 
  RefreshCw, 
  Sliders, 
  AlertTriangle 
} from 'lucide-react';

export const AnalemmaNodeTelemetry: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  
  // Pane A (Rayleigh-Plesset) State parameters
  const [frequency, setFrequency] = useState<number>(24.5); // kHz
  const [pressure, setPressure] = useState<number>(1.35); // atm
  const [baseTemp, setBaseTemp] = useState<number>(12450); // Kelvin
  const [dampingFactor, setDampingFactor] = useState<number>(0.15);
  const [acousticDrive, setAcousticDrive] = useState<number>(1.2); // bar

  // Pane B (Solid-State Pyroelectric) State parameters
  const [crystalTemp, setCrystalTemp] = useState<number>(295.2); // Kelvin
  const [voltage, setVoltage] = useState<number>(104.8); // keV
  const [heatingRate, setHeatingRate] = useState<number>(1.42); // K/s (Delta T / dt)
  const [crystalStatus, setCrystalStatus] = useState<'STABLE' | 'POLARIZING' | 'DISCHARGING'>('POLARIZING');

  // Real-time ticking indicators
  const [timeStep, setTimeStep] = useState<number>(0);
  const [rayleighPoints, setRayleighPoints] = useState<{ x: number; y: number }[]>([]);

  // Sound sweep simulator inside graph
  useEffect(() => {
    // Pre-calculate points for the Rayleigh-Plesset curve representation
    // R(t) vs t
    const points: { x: number; y: number }[] = [];
    const totalPoints = 120;
    
    for (let i = 0; i <= totalPoints; i++) {
      const t = (i / totalPoints) * 10; // 0 to 10 microsecs
      let r = 8.0; // rest radius

      if (t < 4.0) {
        // Linear-ish acoustic expansion phase (bubble gets larger)
        const progress = t / 4.0;
        r = 8.0 + Math.sin(progress * Math.PI / 2) * 32.0 * (acousticDrive * 0.82);
      } else if (t < 5.2) {
        // Sudden violent inertial collapse
        const progress = (t - 4.0) / 1.2;
        r = 40.0 - (progress * 39.4);
        if (r < 0.6) r = 0.6; // minimum collapse limit
      } else if (t < 5.4) {
        // The light emitting flash peak instant!
        r = 0.6 + Math.sin((t - 5.2) * Math.PI * 5) * 1.5;
      } else if (t < 7.5) {
        // Rapid decaying bounces / rebounds
        const bounceTime = t - 5.4;
        const decay = Math.exp(-bounceTime * 1.83 / dampingFactor);
        r = 8.0 + Math.sin(bounceTime * Math.PI * 5.0) * 14.0 * decay;
      } else {
        // Re-establishing ambient dynamic equilibrium
        const fadeTime = t - 7.5;
        r = 8.0 + Math.sin(fadeTime * Math.PI * 2.0) * 0.5 * Math.exp(-fadeTime * 2);
      }

      points.push({ x: i, y: r });
    }
    setRayleighPoints(points);
  }, [dampingFactor, acousticDrive]);

  // Animate values periodically if playing
  useEffect(() => {
    if (!isPlaying) return;

    const timer = setInterval(() => {
      setTimeStep(prev => (prev + 1) % 120);
      
      // Dynamic noise jitter on readings for atmospheric authenticity
      setPressure(prev => {
        const jitter = (Math.random() - 0.5) * 0.02;
        return parseFloat(Math.max(1.10, Math.min(1.60, prev + jitter)).toFixed(3));
      });

      setBaseTemp(prev => {
        const jitter = Math.floor((Math.random() - 0.5) * 120);
        return Math.max(11800, Math.min(13100, prev + jitter));
      });

      // Pyroelectric crystal state transitions loop representation
      setCrystalTemp(prev => {
        const change = heatingRate * 0.15;
        const next = prev + change;
        if (next > 360.0) {
          setCrystalStatus('DISCHARGING');
          setHeatingRate(-2.5); // cooling down
          return 360.0;
        } else if (next < 290.0) {
          setCrystalStatus('POLARIZING');
          setHeatingRate(parseFloat((1.1 + Math.random() * 0.5).toFixed(2))); // heating up again
          return 290.0;
        }
        return parseFloat(next.toFixed(1));
      });

      setVoltage(prev => {
        if (crystalStatus === 'DISCHARGING') {
          // Rapid electrostatic spark discharge
          return Math.max(5.0, prev - 15.2);
        } else {
          // Charging up slowly proportional to polarizing gradient
          const delta = (crystalTemp - 290.0) * 0.15 + (Math.random() * 0.6);
          return parseFloat(Math.min(108.5, Math.max(5.0, prev + delta)).toFixed(1));
        }
      });

    }, 200);

    return () => clearInterval(timer);
  }, [isPlaying, heatingRate, crystalStatus, crystalTemp]);

  const togglePlayback = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <div id="analemma-telemetry-root" className="bg-[#0b0c10]/95 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6 relative overflow-hidden">
      
      {/* Visual neon glowing element on background */}
      <div className="absolute top-0 right-0 w-80 h-[1px] bg-gradient-to-r from-transparent via-purple-500/40 to-cyan-400/20" />
      <div className="absolute -left-12 -top-12 w-32 h-32 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header and Controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b border-slate-950">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-slate-950 border border-slate-900 mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            <span className="font-mono text-[8px] tracking-[0.2em] font-black text-cyan-400">STRUCTURE CODE // THE ANALEMMA NODE</span>
          </div>

          <h3 className="font-display font-black text-xl text-white tracking-widest uppercase">
            Real-Time Telemetry Layer
          </h3>
          <p className="text-xs text-slate-450 mt-1 font-sans">
            Split-pane diagnostic array capturing fluid-gas boundaries and solid-state crystal potentials.
          </p>
        </div>

        {/* Global interactive pause/refresh bar */}
        <div className="flex items-center gap-2.5 bg-slate-950/90 border border-slate-900 px-3 py-2 rounded-xl">
          <button 
            onClick={togglePlayback}
            className={`font-mono text-[9px] font-black px-2.5 py-1 rounded-md transition flex items-center gap-1.5 ${
              isPlaying ? 'bg-amber-950/40 border border-amber-800 text-amber-300 hover:bg-amber-900/40' : 'bg-emerald-950/40 border border-emerald-800 text-emerald-300 hover:bg-emerald-900/40'
            }`}
            aria-label={isPlaying ? "Pause diagnostic metrics simulation" : "Start diagnostic metrics simulation"}
          >
            {isPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
            <span>{isPlaying ? 'PAUSE MONITOR' : 'ENGAGE LIVE'}</span>
          </button>
          
          <button 
            onClick={() => {
              setPressure(1.35);
              setBaseTemp(12450);
              setCrystalTemp(295.2);
              setVoltage(104.8);
              setHeatingRate(1.42);
              setCrystalStatus('POLARIZING');
            }}
            className="p-1 px-2 rounded-md border border-slate-800 hover:bg-slate-900 text-slate-400 transition"
            title="Reset telemetry parameter limits"
            aria-label="Reset telemetry parameter limits"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Split-pane Grid Area */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        
        {/* PANE A: FLUID DYNAMICS (Rayleigh-Plesset Bubble dynamics) */}
        <div className="bg-slate-950/50 border border-slate-900 rounded-2xl p-5 flex flex-col justify-between relative group hover:border-slate-800/80 transition duration-300">
          
          {/* Header */}
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-cyan-950/30 border border-cyan-900/20">
                <Activity className="w-4 h-4 text-cyan-400" />
              </div>
              <div>
                <h4 className="font-display font-light text-slate-200 text-xs tracking-wider uppercase">
                  Pane A: Fluid Boundaries
                </h4>
                <span className="font-mono text-[8px] text-slate-500 uppercase font-black block leading-none">
                  Rayleigh-Plesset solver [R vs. t]
                </span>
              </div>
            </div>
            
            <span className="font-mono text-[9px] text-[#06b6d4] bg-cyan-950/20 px-2 py-0.5 rounded border border-cyan-900/35 font-extrabold shadow-sm">
              SOLVER ACTIVE
            </span>
          </div>

          {/* Interactive Sliders for Rayleigh parameters */}
          <div className="grid grid-cols-2 gap-3 mb-4 bg-slate-950/80 p-3 rounded-xl border border-slate-900">
            <div className="space-y-1">
              <div className="flex justify-between text-[9px] font-mono text-slate-500">
                <span>ACOUSTIC PULSE</span>
                <span className="text-cyan-400 font-bold">{acousticDrive.toFixed(1)} bar</span>
              </div>
              <input 
                type="range"
                min="0.5"
                max="2.0"
                step="0.1"
                value={acousticDrive}
                onChange={(e) => setAcousticDrive(parseFloat(e.target.value))}
                className="w-full accent-cyan-400 h-1 bg-slate-800 rounded-lg cursor-pointer"
                aria-label="Acoustic pressure drive parameter bar"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-[9px] font-mono text-slate-500">
                <span>DAMPING COEFFICIENT</span>
                <span className="text-purple-400 font-bold">{dampingFactor.toFixed(2)}</span>
              </div>
              <input 
                type="range"
                min="0.05"
                max="0.45"
                step="0.02"
                value={dampingFactor}
                onChange={(e) => setDampingFactor(parseFloat(e.target.value))}
                className="w-full accent-purple-500 h-1 bg-slate-800 rounded-lg cursor-pointer"
                aria-label="Acoustic damping factor slider"
              />
            </div>
          </div>

          {/* Rayleigh-Plesset R vs. t Canvas/SVG graph */}
          <div className="bg-slate-950 border border-slate-900/60 rounded-xl p-3 h-48 relative overflow-hidden flex flex-col justify-end">
            
            {/* Overlay grid lines */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />
            
            {/* Graph coordinates labeling annotations */}
            <div className="absolute left-2.5 top-2.5 font-mono text-[8px] text-slate-500 font-bold leading-none select-none uppercase z-10">
              R (μm) [Bubble Radius Scale]
            </div>
            <div className="absolute right-3.5 bottom-2 font-mono text-[8px] text-slate-500 font-bold leading-none select-none uppercase z-10">
              Time (t) → 10μs Sweep Limit
            </div>

            {/* Simulated graph lines drawing via beautiful procedural SVG */}
            <svg viewBox="0 0 120 40" className="w-full h-full block absolute inset-0 pt-6 pb-4">
              {/* Plot spline path line */}
              {rayleighPoints.length > 0 && (
                <path
                  d={`M ${rayleighPoints.map(p => `${p.x},${40 - (p.y * 38 / 50)}`).join(' L ')}`}
                  fill="none"
                  stroke="url(#rayleighGrad)"
                  strokeWidth="1.2"
                  className="transition-all duration-150"
                />
              )}

              {/* Dynamic tracer dot pulsing along path */}
              {rayleighPoints.length > 0 && rayleighPoints[timeStep] && (
                <circle
                  cx={rayleighPoints[timeStep].x}
                  cy={40 - (rayleighPoints[timeStep].y * 38 / 50)}
                  r="1.6"
                  fill="#51e2f5"
                  className="animate-ping"
                />
              )}

              {/* Gradient def */}
              <defs>
                <linearGradient id="rayleighGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#8b5cf6" />
                  <stop offset="40%" stopColor="#06b6d4" />
                  <stop offset="45%" stopColor="#ffffff" />
                  <stop offset="50%" stopColor="#ec4899" />
                  <stop offset="100%" stopColor="#3b82f6" />
                </linearGradient>
              </defs>
            </svg>

            {/* Bubble size visual badge indicator inside graph */}
            <div className="absolute right-3 top-2 flex items-center gap-1 bg-slate-950/90 border border-slate-900 px-2 py-0.5 rounded font-mono text-[8px] text-slate-400 font-bold select-none">
              <span>TRACER:</span>
              <span className="text-cyan-400">
                {rayleighPoints[timeStep] ? (rayleighPoints[timeStep].y).toFixed(2) : '8.00'} μm
              </span>
            </div>

            {/* Under-graph coordinate ticks */}
            <div className="w-full flex justify-between border-t border-slate-900/40 pt-1 text-[7px] font-mono text-slate-500 select-none">
              <span>0.0μs [Start]</span>
              <span>2.5μs [Aero]</span>
              <span>5.0μs [Collapse]</span>
              <span>7.5μs [Bounce]</span>
              <span>10.0μs [End]</span>
            </div>
          </div>

          {/* Core Numerical Readout Blocks */}
          <div className="grid grid-cols-3 gap-2 mt-4 text-center font-mono">
            
            {/* Stat Item 1 */}
            <div className="bg-slate-950 py-2 border border-slate-900 rounded-lg">
              <span className="text-[7.5px] text-slate-500 uppercase block font-black leading-none mb-1">ACOUSTIC DRUM</span>
              <span className="text-xs font-bold text-slate-200 block md:text-[11px] lg:text-xs">
                {frequency} kHz
              </span>
            </div>

            {/* Stat Item 2 */}
            <div className="bg-slate-950 py-2 border border-slate-900 rounded-lg">
              <span className="text-[7.5px] text-slate-500 uppercase block font-black leading-none mb-1">PEAK CRUSH P</span>
              <span className="text-xs font-bold text-cyan-400 block md:text-[11px] lg:text-xs">
                {pressure} atm
              </span>
            </div>

            {/* Stat Item 3 */}
            <div className="bg-slate-950 py-2 border border-slate-900 rounded-lg relative overflow-hidden">
              {/* Highlight flash dot when hot */}
              {baseTemp > 12500 && (
                <span className="absolute top-1.5 right-1.5 w-1 h-1 rounded-full bg-rose-400 animate-pulse" />
              )}
              <span className="text-[7.5px] text-slate-500 uppercase block font-black leading-none mb-1">LOCAL CORES T</span>
              <span className="text-xs font-black text-purple-400 block md:text-[11px] lg:text-xs">
                &gt;{baseTemp.toLocaleString()} K
              </span>
            </div>

          </div>

        </div>

        {/* PANE B: SOLID-STATE (Pyroelectric source schematic blueprints) */}
        <div className="bg-slate-950/50 border border-slate-900 rounded-2xl p-5 flex flex-col justify-between relative group hover:border-slate-800/80 transition duration-300">
          
          {/* Header */}
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-purple-950/30 border border-purple-900/20">
                <Zap className="w-4 h-4 text-purple-400 animate-pulse" />
              </div>
              <div>
                <h4 className="font-display font-light text-slate-200 text-xs tracking-wider uppercase">
                  Pane B: Solid-State Accelerator
                </h4>
                <span className="font-mono text-[8px] text-slate-500 uppercase font-black block leading-none">
                  Pyroelectric crystal source [LiTaO3]
                </span>
              </div>
            </div>
            
            <span className={`font-mono text-[9px] px-2 py-0.5 rounded border font-extrabold shadow-sm transition-all duration-300 ${
              crystalStatus === 'STABLE' ? 'text-slate-400 bg-slate-950 border-slate-800' :
              crystalStatus === 'POLARIZING' ? 'text-purple-400 bg-purple-950/20 border-purple-900/35 animate-pulse' :
              'text-rose-400 bg-rose-950/40 border-rose-900/35'
            }`}>
              {crystalStatus}
            </span>
          </div>

          {/* Detail Parameters */}
          <div className="grid grid-cols-2 gap-3 mb-4 bg-slate-950/80 p-3 rounded-xl border border-slate-900 text-[10px] font-mono">
            <div className="flex justify-between items-center">
              <span className="text-slate-500">CRYSTAL BASE T:</span>
              <span className="text-slate-200 font-bold">{crystalTemp} K</span>
            </div>
            <div className="flex justify-between items-center border-l border-slate-900 pl-3">
              <span className="text-slate-500">CHARGE RATE:</span>
              <span className={`font-bold ${heatingRate > 0 ? 'text-purple-400' : 'text-blue-400'}`}>
                {heatingRate > 0 ? `+${heatingRate}` : heatingRate} K/s
              </span>
            </div>
          </div>

          {/* Pyroelectric crystal schematic blueprint view */}
          <div className="bg-slate-950 border border-slate-900/60 rounded-xl p-3 h-48 relative overflow-hidden flex items-center justify-center">
            
            {/* Grid coordinates overlay blueprint */}
            <div className="absolute inset-0 bg-[#07070a]/95 opacity-90" />
            <div className="absolute inset-0 bg-[linear-gradient(rgba(147,51,234,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(147,51,234,0.015)_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />
            
            <div className="absolute left-2.5 top-2.5 font-mono text-[8px] text-slate-500 font-bold leading-none select-none uppercase z-10">
              LiTaO3 CRYSTAL BLUEPRINT // DETECTOR_09
            </div>

            {/* Central hexagonal crystal vector outline representation */}
            <div className="relative z-10 flex flex-col items-center justify-center w-full h-full">
              
              <svg viewBox="0 0 100 60" className="w-52 h-28 transform overflow-visible">
                {/* Electric field potential lines radiating from the crystal tip */}
                <g stroke="#a855f7" strokeWidth="0.5" strokeDasharray="1.5 1.5" fill="none" opacity={crystalStatus === 'DISCHARGING' ? 0.9 : 0.45}>
                  <path d="M 50,15 L 20,5" />
                  <path d="M 50,15 L 80,5" />
                  <path d="M 50,15 L 10,25" />
                  <path d="M 50,15 L 90,25" />
                  <path d="M 50,45 L 20,55" />
                  <path d="M 50,45 L 80,55" />
                </g>

                {/* Left charging arrows */}
                {crystalStatus === 'POLARIZING' && (
                  <path d="M 12,15 L 22,25 M 12,35 L 22,45" stroke="#22d3ee" strokeWidth="0.8" className="animate-pulse" />
                )}

                {/* Hexagonal Crystal shape (LiTaO3) */}
                <polygon 
                  points="35,15 65,15 75,30 65,45 35,45 25,30" 
                  fill="rgba(147, 51, 234, 0.08)" 
                  stroke={crystalStatus === 'DISCHARGING' ? '#ffffff' : '#8b5cf6'} 
                  strokeWidth="1.2" 
                />

                {/* Deuterated Target ionizing needle point */}
                <line x1="50" y1="15" x2="50" y2="4" stroke="#06b6d4" strokeWidth="1" />
                <circle cx="50" cy="4" r="1.5" fill="#22d3ee" className="animate-pulse" />

                {/* Positive and negative electrostatic surface charge markers */}
                <g fill="#fff" fontSize="5" fontFamily="monospace" fontWeight="bold">
                  {/* Positive charge labels on top face (crystallographic Z+ direction) */}
                  <text x="36" y="21" fill="#ec4899" className="animate-pulse">+</text>
                  <text x="47" y="21" fill="#ec4899" className="animate-pulse">+</text>
                  <text x="58" y="21" fill="#ec4899" className="animate-pulse">+</text>

                  {/* Negative labels on base */}
                  <text x="36" y="42" fill="#3b82f6">-</text>
                  <text x="47" y="42" fill="#3b82f6">-</text>
                  <text x="58" y="42" fill="#3b82f6">-</text>
                </g>

                {/* Thermal gradient flow labeling */}
                <text x="4" y="54" fill="#64748b" fontSize="3.5" fontFamily="monospace">CRYSTAL HEATER [LiTaO3]</text>
                <text x="58" y="10" fill="#06b6d4" fontSize="3.5" fontFamily="monospace" fontWeight="bold">ION TIP</text>
              </svg>

              {/* Spark dynamic particle flash inside blueprint area */}
              {crystalStatus === 'DISCHARGING' && (
                <div className="absolute inset-0 bg-purple-500/10 rounded-xl pointer-events-none flex items-center justify-center animate-pulse">
                  <span className="font-mono text-[9px] text-white bg-purple-900 border border-purple-500 px-2 py-0.5 rounded font-black max-w-xs animate-bounce uppercase">
                    💥 PIEZOELECTRIC DISCHARGE COMPLETED
                  </span>
                </div>
              )}

            </div>
          </div>

          {/* Pane B Numerical values Readouts */}
          <div className="grid grid-cols-3 gap-2 mt-4 text-center font-mono">
            
            {/* Stat Item 1 */}
            <div className="bg-slate-950 py-2 border border-slate-900 rounded-lg">
              <span className="text-[7.5px] text-slate-500 uppercase block font-black leading-none mb-1">ACCEL STATE</span>
              <span className="text-xs font-bold text-slate-200 block md:text-[11px] lg:text-xs">
                {voltage >= 104.0 ? 'MAX POTENTIAL' : 'V_CHARGED'}
              </span>
            </div>

            {/* Stat Item 2 */}
            <div className="bg-slate-950 py-2 border border-slate-900 rounded-lg">
              <span className="text-[7.5px] text-slate-500 uppercase block font-black leading-none mb-1">ACCEL VOLTAGE</span>
              <span className="text-xs font-black text-purple-400 block md:text-[11px] lg:text-xs">
                {voltage} keV
              </span>
            </div>

            {/* Stat Item 3 */}
            <div className="bg-slate-950 py-2 border border-slate-900 rounded-lg">
              <span className="text-[7.5px] text-slate-500 uppercase block font-black leading-none mb-1">THERMAL DRIFT</span>
              <span className="text-xs font-bold text-cyan-400 block md:text-[11px] lg:text-xs">
                ΔT/dt: {heatingRate}
              </span>
            </div>

          </div>

        </div>

      </div>

      {/* Lab Note description box footer inside core section */}
      <div className="p-3 bg-slate-950/90 border border-slate-900/60 rounded-xl flex items-start gap-2.5 text-[11px] text-slate-400 leading-relaxed font-sans">
        <AlertTriangle className="w-4 h-4 text-amber-500/80 shrink-0 mt-0.5 animate-pulse" />
        <p>
          <strong>ANALEMMA SAFETY ADVISORY:</strong> Solid-state crystallization and acoustic wave peaks are coupled inside the vacuum vessel structure. Electrostatic fields exceeding <strong className="text-purple-300">100 keV</strong> at the LiTaO3 tip create focused deuterium ion streams designed to trace Sonoluminescence emission bounds.
        </p>
      </div>

    </div>
  );
};
