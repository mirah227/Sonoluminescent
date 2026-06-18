/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { SimulationParams, TelemetryNode, TerminalLog, NodeId } from './types';
import { InteractiveOrb } from './components/InteractiveOrb';
import mantisShrimpBg from './assets/images/sono_mantis_shrimp_1781645076299.jpg';
import sonoImg from './assets/images/Sono.jpg';
import scientificPoster1 from './assets/images/sono_scientific_poster_1_1781645694943.jpg';
import harmonyPoster2 from './assets/images/sono_harmony_shrimp_person_2_1781645709003.jpg';
import { TelemetryNodeCard } from './components/TelemetryNodeCard';
import { TechnicalTerminal } from './components/TechnicalTerminal';
import { CavitationAnimation } from './components/CavitationAnimation';
import { AnalemmaNodeTelemetry } from './components/AnalemmaNodeTelemetry';
import { 
  Volume2, 
  VolumeX, 
  Cpu, 
  Layers, 
  Activity, 
  FileSpreadsheet, 
  Compass, 
  ShieldCheck, 
  Radio, 
  Sparkles, 
  Clock, 
  Eye, 
  ExternalLink,
  Beaker
} from 'lucide-react';

const INITIAL_NODES: TelemetryNode[] = [
  {
    id: 'sol-alpha',
    name: 'Solar Analemma Node',
    codename: 'node_alpha_sol',
    color: '#f43f5e', // Amber Rose / Red
    accentColor: '#f97316',
    status: 'OPTIMAL',
    frequency: 432, // Healing pythagorean frequency
    description: 'Tracks celestial figure-8 azimuth paths and real-time vertical solar declination.',
    metricLabel: 'Solar Altitude Deviation',
    metricUnit: 'deg',
  },
  {
    id: 'nadir-beta',
    name: 'Magnetic Nadir Node',
    codename: 'node_beta_nadir',
    color: '#06b6d4', // Cyan Blue
    accentColor: '#3b82f6',
    status: 'SYNCED',
    frequency: 528, // Solfeggio sound frequency
    description: 'Measures lunar gravitational pull and field line resonance in micro-teslas.',
    metricLabel: 'Magnetic Flux Intensity',
    metricUnit: 'μT',
  },
  {
    id: 'lumina-gamma',
    name: 'Lumina Wave Lobe',
    codename: 'node_gamma_lumina',
    color: '#8b5cf6', // Violet Purple
    accentColor: '#ec4899',
    status: 'MUTUAL',
    frequency: 639, // Multi-channel portal pulse
    description: 'Monitors thermal wave-packet fluctuations and radio microwave coherence state.',
    metricLabel: 'Spectral Density Coherence',
    metricUnit: 'ratio',
  }
];

const customStyles = `
  :root {
    --bg: #0B0C10;
    --card: #1F2833;
    --text: #E5E7EB;
    --muted: #9CA3AF;
    --violet: #9D4EDD;
    --cyan: #00F5D4;
  }

  [data-theme="light"] {
    --bg: #F5F5F7;
    --card: #FFFFFF;
    --text: #0B0C10;
    --muted: #4B5563;
  }

  /* Custom Layout Overrides & Classes and Mobile responsiveness adjustments */
  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 24px;
  }

  .hero h1 {
    font-size: 48px;
    margin-bottom: 16px;
  }

  .cta-group {
    display: flex;
    gap: 16px;
    justify-content: center;
    flex-wrap: wrap;
  }

  .btn {
    padding: 12px 24px;
    border-radius: 8px;
    border: 1px solid var(--cyan);
    color: var(--cyan);
    background: transparent;
    cursor: pointer;
    font-size: 14px;
    transition: all 0.2s ease-in-out;
  }

  .btn.primary {
    background: var(--violet);
    border-color: var(--violet);
    color: #FFFFFF;
  }
  
  [data-theme="light"] .btn.primary {
    color: #FFFFFF;
  }

  /* Telemetry split-pane */
  .telemetry-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 24px;
    padding: 40px 0;
  }

  .telemetry-card {
    background: var(--card);
    border: 1px solid rgba(147, 51, 234, 0.15);
    border-radius: 8px;
    padding: 24px;
  }

  .telemetry-card h3 {
    margin-bottom: 12px;
    color: var(--cyan);
  }

  .data-row {
    display: flex;
    justify-content: space-between;
    font-family: 'JetBrains Mono', monospace;
    font-size: 13px;
    color: var(--text);
    padding: 8px 0;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  }
  
  [data-theme="light"] .data-row {
    border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  }

  /* Tokenomics table */
  .tokenomics-wrapper {
    margin-top: 24px;
    border-radius: 12px;
  }

  .tokenomics-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 13px;
    background: var(--card);
    border: 1px solid rgba(147, 51, 234, 0.15);
    border-radius: 12px;
    overflow: hidden;
  }

  .tokenomics-table th,
  .tokenomics-table td {
    padding: 14px 18px;
    text-align: left;
    border-bottom: 1px solid rgba(147, 51, 234, 0.1);
  }

  .tokenomics-table th {
    color: var(--violet);
    background: rgba(147, 51, 234, 0.03);
    font-weight: 700;
    text-transform: uppercase;
    font-size: 11px;
    letter-spacing: 0.1em;
  }

  /* ===== MOBILE BREAKPOINTS ===== */
  @media (max-width: 768px) {
    .hero-h1-responsive {
      font-size: 32px !important;
    }

    .telemetry-grid {
      grid-template-columns: 1fr;
      gap: 16px;
    }

    .cta-group {
      flex-direction: column;
      align-items: center;
    }

    .btn {
      width: 100%;
      max-width: 280px;
      text-align: center;
    }

    /* Make tokenomics table scrollable on mobile */
    .tokenomics-wrapper {
      overflow-x: auto;
      width: 100%;
    }

    .tokenomics-table {
      min-width: 600px;
    }
  }

  @media (max-width: 480px) {
    .hero-h1-responsive {
      font-size: 24px !important;
    }

    .data-row {
      font-size: 12px;
    }
  }
`;

export default function App() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Escape key down listener for closing high res scientific posters overlay modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedPoster(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
  window.scrollTo({ top: 0, behavior: 'instant' });
}, []);

  // Main simulation configurations
  const [params, setParams] = useState<SimulationParams>({
    speed: 1.0,
    excitation: 6,
    resonance: 30,
    dissipation: 75,
    graviton: 25,
  });

  // Real-time bottom data strip variables
  const [solanaBlock, setSolanaBlock] = useState(48103);
  const [tickerMetrics, setTickerMetrics] = useState({
    pressure: 1.48,
    velocity: 1230,
    temp: 15200,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setSolanaBlock(prev => prev + Math.floor(Math.random() * 2) + 1);
      setTickerMetrics({
        pressure: parseFloat((1.35 + (params.resonance * 0.003) + (Math.random() * 0.04)).toFixed(2)),
        velocity: Math.floor(1210 + (params.speed * 45) + Math.random() * 12),
        temp: Math.floor(14950 + (params.excitation * 42) + Math.random() * 80),
      });
    }, 1500);
    return () => clearInterval(timer);
  }, [params.resonance, params.speed, params.excitation]);

  // Active state trackers
  const [nodes, setNodes] = useState<TelemetryNode[]>(INITIAL_NODES);
  const [activeNodeId, setActiveNodeId] = useState<NodeId>('sol-alpha');
  const [logs, setLogs] = useState<TerminalLog[]>([
    {
      id: 'init-1',
      timestamp: new Date().toLocaleTimeString(),
      level: 'SYS',
      message: 'Sonoluminescence Telemetry Portal v3.12 initialized.',
    },
    {
      id: 'init-2',
      timestamp: new Date().toLocaleTimeString(),
      level: 'INF',
      message: 'Listening on port 3000. Core clock sync: 2026-06-12 UTC.',
    },
    {
      id: 'init-3',
      timestamp: new Date().toLocaleTimeString(),
      level: 'INF',
      message: 'Selected primary node_alpha_sol at base tuning of 432 Hz.',
    }
  ]);

  // Real-time audio synth states
  const [audioActive, setAudioActive] = useState<boolean>(false);
  const [audioVolume, setAudioVolume] = useState<number>(30); // 0-100%
  const [selectedPoster, setSelectedPoster] = useState<'poster1' | 'poster2' | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const osc1Ref = useRef<OscillatorNode | null>(null);
  const osc2Ref = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const filterNodeRef = useRef<BiquadFilterNode | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animFrameAudioRef = useRef<number | null>(null);
  const audioCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const activeNode = nodes.find(n => n.id === activeNodeId) || nodes[0];

  // Quick helper to write neat logs dynamically
  const addLog = (level: 'INF' | 'WRN' | 'SYS', message: string) => {
    const freshLog: TerminalLog = {
      id: Date.now().toString() + Math.random().toString(),
      timestamp: new Date().toLocaleTimeString(),
      level,
      message,
    };
    setLogs((prev) => [...prev, freshLog]);
  };

  // Keep live metrics drifting slowly over time to simulate incoming telemetry
  useEffect(() => {
    const interval = setInterval(() => {
      // Small random status drift to be highly dynamic
      setNodes((prevNodes) =>
        prevNodes.map((n) => {
          if (Math.random() > 0.85) {
            const statuses: TelemetryNode['status'][] = ['OPTIMAL', 'SYNCED', 'DRIFTING', 'MUTUAL'];
            const nextStatus = statuses[Math.floor(Math.random() * statuses.length)];
            
            // Log the status transition if selected
            if (n.id === activeNodeId && nextStatus !== n.status) {
              addLog('WRN', `Node ${n.codename} state shift detected: -> ${nextStatus}`);
            }

            return {
              ...n,
              status: nextStatus,
            };
          }
          return n;
        })
      );
    }, 4000);

    return () => clearInterval(interval);
  }, [activeNodeId]);

  // Web Audio Synthesizer lifecycle control
  const startSynthesizer = () => {
    try {
      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtxClass) {
        addLog('WRN', 'Web Audio API is not supported in this client environment.');
        return;
      }

      const audioCtx = new AudioCtxClass();
      audioCtxRef.current = audioCtx;

      // Create subtractive warm synthesis graph
      const osc1 = audioCtx.createOscillator();
      const osc2 = audioCtx.createOscillator();
      const filterNode = audioCtx.createBiquadFilter();
      const gainNode = audioCtx.createGain();
      const analyserNode = audioCtx.createAnalyser();

      // Configure beautiful sub-resonance detune drone (perfect fifth / solfeggio chords)
      osc1.type = 'triangle'; // Warm, flute-like tone
      osc2.type = 'sine';     // Earthy depth tone

      // Detuned chorus width
      osc1.frequency.setValueAtTime(activeNode.frequency, audioCtx.currentTime);
      osc2.frequency.setValueAtTime(activeNode.frequency * 1.5, audioCtx.currentTime); // Perfect 5th

      // Set up lowpass sweep resonance
      filterNode.type = 'lowpass';
      // Lowpass mapped to central Resonance parameter
      const cutoffFreq = 200 + (params.resonance * 18);
      filterNode.frequency.setValueAtTime(cutoffFreq, audioCtx.currentTime);
      filterNode.Q.setValueAtTime(3.5, audioCtx.currentTime);

      // Volume Gain relative limit
      const currentGain = (audioVolume / 100) * 0.12; 
      gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
      gainNode.gain.linearRampToValueAtTime(currentGain, audioCtx.currentTime + 0.5);

      // Connect node graph
      osc1.connect(filterNode);
      osc2.connect(filterNode);
      filterNode.connect(gainNode);
      gainNode.connect(analyserNode);
      analyserNode.connect(audioCtx.destination);

      // Start sound oscillators
      osc1.start();
      osc2.start();

      osc1Ref.current = osc1;
      osc2Ref.current = osc2;
      filterNodeRef.current = filterNode;
      gainNodeRef.current = gainNode;
      analyserRef.current = analyserNode;

      setAudioActive(true);
      addLog('SYS', `Acoustic SONO synthesizer activated on ${activeNode.frequency} Hz drone.`);
      
      // Fire oscilloscope loop
      drawOscilloscope();

    } catch (err: any) {
      console.error(err);
      addLog('WRN', `Audio context initialization halted: ${err.message}`);
    }
  };

  const stopSynthesizer = () => {
    if (audioCtxRef.current) {
      // Fade out gain node smoothly to prevent click pops
      if (gainNodeRef.current) {
        gainNodeRef.current.gain.linearRampToValueAtTime(0, audioCtxRef.current.currentTime + 0.15);
      }
      
      setTimeout(() => {
        try {
          osc1Ref.current?.stop();
          osc2Ref.current?.stop();
        } catch (_) {}
        
        audioCtxRef.current?.close();
        audioCtxRef.current = null;
        osc1Ref.current = null;
        osc2Ref.current = null;
        filterNodeRef.current = null;
        gainNodeRef.current = null;
        analyserRef.current = null;
        setAudioActive(false);
        addLog('SYS', 'Acoustic SONO synthesizer deactivated. Audio channel idle.');
      }, 160);
    }
  };

  const toggleSound = () => {
    if (audioActive) {
      stopSynthesizer();
    } else {
      startSynthesizer();
    }
  };

  // Adjust frequencies synchronously when state parameters alter
  useEffect(() => {
    if (audioActive && audioCtxRef.current) {
      const timeNow = audioCtxRef.current.currentTime;
      
      // Map base active pitch
      osc1Ref.current?.frequency.exponentialRampToValueAtTime(activeNode.frequency, timeNow + 0.25);
      // Perfect 5th chord overlay
      osc2Ref.current?.frequency.exponentialRampToValueAtTime(activeNode.frequency * 1.5, timeNow + 0.25);

      // Sweep lowpass cutoff based on physical speed and resonance parameters
      const mappedCutoff = 200 + (params.resonance * 18) + (params.speed * 80);
      filterNodeRef.current?.frequency.exponentialRampToValueAtTime(mappedCutoff, timeNow + 0.15);
    }
  }, [activeNodeId, params.resonance, params.speed, audioActive]);

  // Live volume alterations
  useEffect(() => {
    if (audioActive && audioCtxRef.current && gainNodeRef.current) {
      const targetVolume = (audioVolume / 100) * 0.12;
      gainNodeRef.current.gain.linearRampToValueAtTime(targetVolume, audioCtxRef.current.currentTime + 0.1);
    }
  }, [audioVolume, audioActive]);

  // Clean exit synthesis to prevent ghost sounds
  useEffect(() => {
    return () => {
      if (animFrameAudioRef.current) cancelAnimationFrame(animFrameAudioRef.current);
      if (audioCtxRef.current) {
        try {
          osc1Ref.current?.stop();
          osc2Ref.current?.stop();
          audioCtxRef.current.close();
        } catch (_) {}
      }
    };
  }, []);

  // Oscilloscope drawing logic targeting the audio sub-canvas
  const drawOscilloscope = () => {
    const canvas = audioCanvasRef.current;
    const analyser = analyserRef.current;
    if (!canvas || !analyser) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      if (!audioActive) {
        ctx.fillStyle = '#08080f';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        // Draw flat line
        ctx.strokeStyle = '#334155';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, canvas.height / 2);
        ctx.lineTo(canvas.width, canvas.height / 2);
        ctx.stroke();
        return;
      }

      animFrameAudioRef.current = requestAnimationFrame(draw);
      analyser.getByteTimeDomainData(dataArray);

      ctx.fillStyle = '#07070d';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Subtle cyber grid backdrop inside acoustic oscillos
      ctx.strokeStyle = 'rgba(30, 41, 59, 0.4)';
      ctx.lineWidth = 0.5;
      ctx.beginPath();
      for (let i = 0; i < canvas.width; i += 30) {
        ctx.moveTo(i, 0); ctx.lineTo(i, canvas.height);
      }
      for (let i = 0; i < canvas.height; i += 15) {
        ctx.moveTo(0, i); ctx.lineTo(canvas.width, i);
      }
      ctx.stroke();

      ctx.lineWidth = 1.5;
      ctx.strokeStyle = activeNode.color;
      ctx.beginPath();

      const sliceWidth = (canvas.width * 1.0) / bufferLength;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 128.0;
        const y = (v * canvas.height) / 2;

        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);

        x += sliceWidth;
      }

      ctx.lineTo(canvas.width, canvas.height / 2);
      ctx.stroke();
    };

    draw();
  };

  // Draw scope initially
  useEffect(() => {
    if (!audioActive) {
      const canvas = audioCanvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.fillStyle = '#07070d';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.strokeStyle = 'rgba(71, 85, 105, 0.3)';
          ctx.beginPath();
          ctx.moveTo(0, canvas.height / 2);
          ctx.lineTo(canvas.width, canvas.height / 2);
          ctx.stroke();
        }
      }
    }
  }, [audioActive]);

  // Handle generic UI control modifications
  const handleControlChange = (param: keyof SimulationParams, value: number) => {
    setParams((prev) => ({ ...prev, [param]: value }));
    
    // Throttle logs slightly to avoid spamming
    if (Math.random() > 0.45) {
      addLog('INF', `Parameters adjustment triggered live. ${param} altered: ${value}`);
    }
  };

  // Node switcher from card selection click
  const handleSelectNode = (nodeId: string) => {
    const nextId = nodeId as NodeId;
    setActiveNodeId(nextId);
    
    const nodeObj = nodes.find(n => n.id === nextId);
    if (nodeObj) {
      addLog('SYS', `Node terminal swapped backlink to: ${nodeObj.codename} (${nodeObj.name}) at ${nodeObj.frequency} Hz.`);
    }
  };

  // Interactive Command Terminal Executer
  const executeTerminalCommand = (rawText: string) => {
    const clean = rawText.trim().toLowerCase();
    
    // Command logs reflection
    addLog('INF', `Guest terminal input: "${rawText}"`);

    if (clean === '/help') {
      addLog('SYS', '=== AVAILABLE DIAGNOSTICS DIRECTIVES ===');
      addLog('SYS', ' /help                - Show scientific telemetry dictionary codes.');
      addLog('SYS', ' /clear               - Truncate output print buffer.');
      addLog('SYS', ' /sync <frequency>    - Drive core audio oscillator to exact pitch (e.g. 440).');
      addLog('SYS', ' /boost               - Trigger maximum excitation and rapid rotation velocity.');
      addLog('SYS', ' /relax               - Dial orbit metrics down to tranquility values.');
      addLog('SYS', ' /preset <sol/nadir/lumina> - Instantly swap active tracking telemetry nodes.');
      return;
    }

    if (clean === '/clear') {
      // handshaking clear directly
      setLogs([
        {
          id: 'cleared-manual',
          timestamp: new Date().toLocaleTimeString(),
          level: 'SYS',
          message: 'Telemetry console flushed. Session ongoing.'
        }
      ]);
      return;
    }

    if (clean.startsWith('/sync ')) {
      const numSegment = clean.replace('/sync ', '').trim();
      const num = parseInt(numSegment);
      if (!isNaN(num) && num >= 60 && num <= 2000) {
        // Find selected node and replace frequency
        setNodes((prevNodes) =>
          prevNodes.map((n) => {
            if (n.id === activeNodeId) {
              return { ...n, frequency: num };
            }
            return n;
          })
        );
        addLog('SYS', `Sync tuning established! Frequency updated to: ${num} Hz.`);
      } else {
        addLog('WRN', 'Sync command failure: frequencies must range between [60 - 2000] Hz.');
      }
      return;
    }

    if (clean === '/boost') {
      setParams({
        speed: 2.8,
        excitation: 14,
        resonance: 85,
        dissipation: 45,
        graviton: 70,
      });
      addLog('SYS', 'BOOST PROTOCOL INITIATED: Max RPM registered, high wave packet excitation.');
      return;
    }

    if (clean === '/relax') {
      setParams({
        speed: 0.5,
        excitation: 4,
        resonance: 15,
        dissipation: 85,
        graviton: 15,
      });
      addLog('SYS', 'RELAX COMMITTED: Orbital kinetic dampening engaged. Stabilizing fields.');
      return;
    }

    if (clean.startsWith('/preset ')) {
      const sub = clean.replace('/preset ', '').trim();
      if (sub === 'sol' || sub === 'alpha') {
        setActiveNodeId('sol-alpha');
        addLog('SYS', 'Linked to Solar Analemma preset.');
      } else if (sub === 'nadir' || sub === 'beta') {
        setActiveNodeId('nadir-beta');
        addLog('SYS', 'Linked to Magnetic Nadir preset.');
      } else if (sub === 'lumina' || sub === 'gamma') {
        setActiveNodeId('lumina-gamma');
        addLog('SYS', 'Linked to Violet Lumina preset.');
      } else {
        addLog('WRN', 'Preset error: unknown target. Available values: sol, nadir, lumina.');
      }
      return;
    }

    // Unrecognized fallback command
    addLog('WRN', `Directive "${rawText}" unparsed. Prefix "/help" to view directory listing.`);
  };

  // Fast scientific presets to trigger instantly from sidebar clicks
  const triggerPreset = (key: 'solar-storm' | 'super-magnetic' | 'violet-chaos') => {
    if (key === 'solar-storm') {
      setActiveNodeId('sol-alpha');
      setParams({
        speed: 2.3,
        excitation: 11,
        resonance: 75,
        dissipation: 55,
        graviton: 40,
      });
      addLog('SYS', 'Triggered Preset [Solar Storm Align]: Solar alt activity synchronized.');
    } else if (key === 'super-magnetic') {
      setActiveNodeId('nadir-beta');
      setParams({
        speed: 1.2,
        excitation: 8,
        resonance: 40,
        dissipation: 85,
        graviton: 90, // Intense pull!
      });
      addLog('SYS', 'Triggered Preset [Super Magnetic Nadir]: Deep particle compression active.');
    } else {
      setActiveNodeId('lumina-gamma');
      setParams({
        speed: 1.8,
        excitation: 15,
        resonance: 90,
        dissipation: 60,
        graviton: 10,
      });
      addLog('SYS', 'Triggered Preset [Lumina Chaos]: Spectral frequencies sweep energized.');
    }
  };
  return (
    <div className="bg-[var(--bg)] text-[var(--text)] min-h-screen relative overflow-x-hidden font-sans antialiased selection:bg-purple-500/30 selection:text-white transition-colors duration-300">
      <style>{customStyles}</style>
      
      {/* Dynamic Cosmic Vacuum Ambient Glow blooms */}
      <div className="absolute top-0 right-[-100px] w-[500px] h-[500px] bg-purple-950/15 rounded-full blur-[140px] mix-blend-screen pointer-events-none" />
      <div className="absolute bottom-12 left-[-150px] w-[550px] h-[550px] bg-cyan-950/10 rounded-full blur-[130px] mix-blend-screen pointer-events-none" />
      <div className="absolute top-[40%] left-[30%] w-[350px] h-[350px] bg-indigo-950/15 rounded-full blur-[110px] mix-blend-screen pointer-events-none" />

      {/* Modern Tech Grid Graticule Overlay to represent vacuum coordinates */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(147,51,234,0.007)_1px,transparent_1px),linear-gradient(90deg,rgba(147,51,234,0.007)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none opacity-90" />

      {/* Decorative Brand Emblem Watermarks in background */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden select-none opacity-[0.03] sm:opacity-[0.045] mix-blend-screen">
        {/* Large upper-right background watermark near the hero section */}
        <div className="absolute top-[4%] right-[-10%] sm:right-[5%] w-[550px] h-[550px] md:w-[750px] md:h-[750px] rounded-full filter blur-[1.5px]">
          <img
            src={mantisShrimpBg}
            alt="SONO Mantis Shrimp Emblem Watermark Right"
            className="w-full h-full object-cover rounded-full"
            referrerPolicy="no-referrer"
          />
        </div>
        
        {/* Large middle-left background watermark behind telemetry */}
        <div className="absolute top-[35%] left-[-15%] sm:left-[-5%] w-[600px] h-[600px] md:w-[800px] md:h-[800px] rounded-full filter blur-[2px]">
          <img
            src={mantisShrimpBg}
            alt="SONO Mantis Shrimp Emblem Watermark Middle Left"
            className="w-full h-full object-cover rounded-full"
            referrerPolicy="no-referrer"
          />
        </div>

        {/* Large lower background watermark behind roadmap/tokenomics */}
        <div className="absolute bottom-[8%] left-[50%] -translate-x-1/2 w-[600px] h-[600px] md:w-[850px] md:h-[850px] rounded-full filter blur-[1px]">
          <img
            src={mantisShrimpBg}
            alt="SONO Mantis Shrimp Emblem Watermark Lower"
            className="w-full h-full object-cover rounded-full"
            referrerPolicy="no-referrer"
          />
        </div>
      </div>

      {/* 1. Header Navigation Bar */}
      <header className="border-b border-purple-950/20 bg-[#0B0C10]/95 backdrop-blur-md sticky top-0 z-40 shadow-xl shadow-black/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex justify-between items-center">
          
          {/* Logo Name & Lab indicator */}
          <div className="flex items-center gap-3">
            <div className="relative w-11 h-11 rounded-full bg-gradient-to-tr from-purple-500 to-cyan-450 p-[1px] shadow-lg shadow-purple-500/20 flex-shrink-0">
              <img
                src={sonoImg}
                alt="SONO Brand Icon"
                className="w-full h-full object-cover rounded-full"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-display font-extrabold text-sm tracking-[0.2em] text-white">SONOLUMINESCENCE</span>
              </div>
              <span className="font-mono text-[9px] uppercase tracking-widest text-cyan-400 block leading-none mt-0.5">
                LAB VACUUM CONTROLLER v3.5
              </span>
            </div>
          </div>

          {/* Quick HUD Navigation Links */}
          <nav className="hidden xl:flex items-center gap-6 font-mono text-[10.5px] text-slate-400 font-bold tracking-wider">
            <button 
              onClick={() => {
                document.getElementById('flask-cavitation')?.scrollIntoView({ behavior: 'smooth' });
                addLog('INF', 'Aligning perspective to [Core Cavitation Flask View]...');
              }}
              className="hover:text-purple-400 transition"
            >
              CORE TECH
            </button>
            <button 
              onClick={() => {
                document.getElementById('what-is-sono')?.scrollIntoView({ behavior: 'smooth' });
                addLog('INF', 'Viewing [What is Sonoluminescence] physical principles breakdown.');
              }}
              className="hover:text-purple-400 transition text-cyan-400"
            >
              WHAT IS SONO?
            </button>
            <button 
              onClick={() => {
                document.getElementById('research-mission')?.scrollIntoView({ behavior: 'smooth' });
                addLog('INF', 'Loading UCLA DeSci Research Mission matrix...');
              }}
              className="hover:text-purple-400 transition"
            >
              RESEARCH MISSION
            </button>
            <button 
              onClick={() => {
                document.getElementById('analemma-telemetry')?.scrollIntoView({ behavior: 'smooth' });
                addLog('INF', 'Loading Analemma solid-state/fluid diagnostic layers...');
              }}
              className="hover:text-purple-400 transition text-amber-300 font-extrabold"
            >
              ANALEMMA NODE
            </button>
            <button 
              onClick={() => {
                document.getElementById('telemetry-dashboard')?.scrollIntoView({ behavior: 'smooth' });
                addLog('INF', 'Gaging central Telemetry Dashboard controllers...');
              }}
              className="hover:text-purple-400 transition"
            >
              TELEMETRY DASHBOARD
            </button>
            <button 
              onClick={() => {
                document.getElementById('tokenomics')?.scrollIntoView({ behavior: 'smooth' });
                addLog('INF', 'Reviewing $SONO DeSci token distribution mechanics...');
              }}
              className="hover:text-purple-400 transition"
            >
              TOKENOMICS
            </button>
            <button 
              onClick={() => {
                addLog('INF', '📡 CONNECTING CO-LAB SECURE CHANNEL TO UCLA PHYSICS DEPT...');
                setTimeout(() => {
                  addLog('SYS', '🐻 UCLA Lab Status: CONNECTED // CRYPTO STATE SYNCHRONIZED [EPOCH 812 // TEMP: 15.2K K]');
                }, 600);
              }}
              className="hover:text-cyan-400 transition flex items-center gap-1 text-purple-400 bg-purple-950/30 px-3 py-1.5 rounded-lg border border-purple-900/30 font-extrabold"
            >
              <span>UCLA LAB METRICS</span>
            </button>
          </nav>

          {/* Theme Switcher & Launch App Actions */}
          <div className="flex items-center gap-3">
            <a
              href="https://x.com/sonokcex"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 border border-purple-500/15 hover:border-purple-500/50 rounded-xl transition bg-purple-950/10 text-slate-400 hover:text-cyan-400"
              aria-label="X (Twitter)"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>

            <a
              href="https://t.me/SONOLUMINESENCE5"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 border border-purple-500/15 hover:border-purple-500/50 rounded-xl transition bg-purple-950/10 text-slate-400 hover:text-purple-400"
              aria-label="Telegram"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.568 8.16-1.61 7.59c-.12.54-.44.67-.89.42l-2.46-1.81-1.19 1.14c-.13.13-.24.24-.49.24l.18-2.49 4.54-4.1c.2-.18-.04-.28-.31-.1l-5.61 3.53-2.42-.76c-.53-.16-.54-.53.11-.79l9.45-3.64c.44-.16.83.11.69.81z"/>
              </svg>
            </a>

            <a
              href="https://share.google/KT6E4fnWzfGG3NjTu"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 border border-purple-500/15 hover:border-purple-500/50 rounded-xl transition bg-purple-950/10 text-slate-400 hover:text-emerald-400"
              title="Official Research Documentation"
              aria-label="Research Documentation"
            >
              <Beaker className="w-[18px] h-[18px]" strokeWidth={2} />
            </a>

            <button
              onClick={() => {
                const nextTheme = theme === 'dark' ? 'light' : 'dark';
                setTheme(nextTheme);
                addLog('SYS', `UI theme updated: -> ${nextTheme.toUpperCase()} mode.`);
              }}
              className="font-mono text-[9.5px] font-black border border-purple-500/20 hover:border-purple-500/50 hover:text-purple-400 px-3 py-2 rounded-xl transition bg-purple-950/15 text-slate-300"
              title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            >
              <span className="mr-1">{theme === 'dark' ? '🌙' : '🌞'}</span>
              <span className="hidden sm:inline">{theme === 'dark' ? 'DARK' : 'LIGHT'}</span>
            </button>

            <button 
              id="nav-launch-app-cta"
              onClick={() => {
                document.getElementById('telemetry-dashboard')?.scrollIntoView({ behavior: 'smooth' });
                addLog('INF', 'Direct anchor warp to central Telemetry Dashboard.');
              }}
              className="font-mono text-[11px] font-black text-black bg-gradient-to-r from-purple-400 to-cyan-400 hover:from-purple-300 hover:to-cyan-300 px-5 py-2.5 rounded-xl transition duration-300 transform hover:scale-[1.04] active:scale-[0.97] shadow-lg shadow-purple-500/10"
            >
              Launch App
            </button>
          </div>
        </div>
      </header>

      {/* 2. Main Hero Section Stage & Visual Core */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
        <h1 className="sr-only">Sonoluminescence Telemetry Portal</h1>

        {/* Featured Project $SONO Lab Banner */}
        <div className="mb-10 rounded-3xl overflow-hidden border border-purple-500/15 bg-gradient-to-r from-purple-950/20 via-[#0a0a0f] to-[#0b0c10] shadow-2xl relative">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-transparent to-cyan-500/5 pointer-events-none" />
          <div className="flex flex-col md:flex-row items-stretch justify-between">
            <div className="p-6 md:p-8 flex flex-col justify-center space-y-4 md:max-w-xl text-left">
              <div className="inline-flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-[0.2em] text-cyan-400 bg-cyan-950/40 border border-cyan-800/35 px-2.5 py-1 rounded-full w-fit">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                PRIMARY LABORATORY EYE
              </div>
              <h2 className="font-display text-xl md:text-2xl font-black text-white uppercase tracking-wider">
                Project $SONO Laboratory Core Active
              </h2>
              <p className="text-xs text-slate-350 leading-relaxed font-sans mt-1">
                The primary observation feed captures high-velocity cavitation events generating real-time photon emission. Integrated at boot state to synchronize the decentralized physical infrastructure network (DePIN).
              </p>
              <div className="font-mono text-[9px] text-slate-500 flex flex-wrap items-center gap-x-4 gap-y-1.5 pt-1">
                <span>METRIC SPEED: <strong className="text-cyan-400">23.4 m/s</strong></span>
                <span>•</span>
                <span>ENERGY SPECTRUM: <strong className="text-purple-400">1.21 kV</strong></span>
                <span>•</span>
                <span>STATUS: <strong className="text-emerald-400 font-bold">SYNCHRONIZED</strong></span>
              </div>
            </div>
            
            {/* Visual Side Banner Frame */}
            <div className="relative h-48 md:h-auto md:w-[45%] lg:w-[40%] bg-slate-950 overflow-hidden border-t md:border-t-0 md:border-l border-purple-950/30">
              <img
                src={sonoImg}
                alt="Project SONO Core Camera Feed"
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-r md:bg-gradient-to-l from-transparent via-[#0b0c10]/20 to-[#0b0c10] pointer-events-none" />
              <div className="absolute bottom-3 right-3 bg-black/80 border border-purple-500/30 font-mono text-[8.5px] text-purple-300 px-2 py-1 rounded-lg">
                LIVE CAMERA STAGE // 01
              </div>
            </div>
          </div>
        </div>
        
        <section id="flask-cavitation" className="mb-12 py-6 md:py-12 relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left Hero Details block */}
            <div className="lg:col-span-5 space-y-6 text-left">
              
              {/* Eyebrow tag callout */}
              <div className="inline-flex items-center gap-2 bg-[#120a21]/80 border border-purple-900/40 px-3 py-1.5 rounded-full backdrop-blur-md">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-ping" />
                <span className="font-mono text-[9.5px] font-extrabold uppercase tracking-widest text-[#d8b4fe]">
                  DeSci / Solana / UCLA research initiative
                </span>
              </div>

              {/* Main title + SONO ticker */}
              <div className="space-y-4">
                <h2 className="font-display text-4xl sm:text-5xl lg:text-5xl font-black tracking-tight text-white leading-none hero-h1-responsive">
                  SONOLUMINESCENCE
                </h2>
                <div className="inline-flex items-center gap-2 bg-slate-950/80 px-3 py-1 rounded-lg border border-purple-950/40 font-mono text-[10px] text-cyan-400 font-extrabold">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                  <span>TICKER: $SONO</span>
                </div>
              </div>

              {/* Tagline */}
              <h3 className="text-lg md:text-xl font-display font-medium text-slate-200 tracking-tight leading-snug">
                Converting high-intensity ultrasonic pressure waves inside a confined vacuum state into persistent photonic energy fields.
              </h3>

              {/* Description Paragraph */}
              <p className="text-xs text-slate-400 leading-relaxed font-sans font-normal max-w-xl">
                Witness the single-bubble cavitation transition of acoustic energy into clean light fields inside our vacuum-confined core. Powered by multi-channel acoustic sweep fields, we capture collapsing bubble metrics, authenticated immediately on-chain via speed-optimized Solana block logs in integration with UCLA’s Decentralized Science Lab.
              </p>

              {/* Two CTA Buttons inside Hero */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  id="hero-scroll-workspace-btn"
                  onClick={() => {
                    document.getElementById('telemetry-dashboard')?.scrollIntoView({ behavior: 'smooth' });
                    addLog('INF', 'Aligning console viewport to telemetry workspace dashboard. Loading nodes...');
                  }}
                  className="font-mono text-xs font-bold text-black bg-gradient-to-r from-purple-400 to-cyan-400 hover:from-purple-300 hover:to-cyan-300 px-6 py-4 rounded-xl transition duration-200 transform hover:-translate-y-0.5 shadow-lg shadow-purple-500/15"
                >
                  Explore Live Nodes
                </button>
                <button
                  id="hero-toggle-synth-btn"
                  onClick={() => {
                    toggleSound();
                  }}
                  className={`font-mono text-xs font-bold px-5 py-3.5 rounded-xl transition flex items-center gap-2 border shadow ${
                    audioActive 
                      ? 'bg-rose-950/40 border-rose-600 text-rose-300 hover:bg-rose-950/60' 
                      : 'bg-purple-950/40 border-purple-600 text-purple-300 hover:bg-purple-950/60'
                  }`}
                >
                  {audioActive ? 'MUTE SOUND DRONE' : 'INITIALIZE SOUND DRONE'}
                </button>
              </div>

              {/* Official Brand Badge card */}
              <div className="inline-flex items-center gap-4 bg-gradient-to-r from-purple-950/30 via-cyan-950/20 to-slate-950/40 border border-purple-500/15 p-3 rounded-2xl max-w-full sm:max-w-md shadow-lg shadow-black/40 backdrop-blur-sm mt-3">
                <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 border border-purple-500/30 p-[0.5px]">
                  <img
                    src={sonoImg}
                    alt="SONO Brand Emblem"
                    className="w-full h-full object-cover rounded-xl"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="text-left">
                  <div className="flex items-center gap-1.5 font-semibold">
                    <span className="font-mono text-[8px] font-black text-cyan-400 tracking-wider">OFFICIAL BRAND KEYSTONE</span>
                  </div>
                  <h4 className="font-display text-[10.5px] font-extrabold text-white leading-tight uppercase tracking-wider">
                    The Harmony of Sound &amp; Light
                  </h4>
                  <p className="text-[9.5px] text-slate-400 leading-normal font-sans mt-0.5">
                    High-intensity cavitation physics meets the biological sonar power of the legendary Mantis Shrimp.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Hero Block - Animated Violet Flask Core */}
            <div className="lg:col-span-7 h-[460px]">
              <InteractiveOrb
                params={params}
                setParams={setParams}
                activeNodeColor={activeNode.color}
                activeNodeAccent={activeNode.accentColor}
                activeNodeId={activeNode.id}
                onControlChange={handleControlChange}
                audioActive={audioActive}
                frequency={activeNode.frequency}
              />
            </div>

          </div>
        </section>

        {/* 3. Bottom Data Strip with live-looking telemetry figures */}
        <section className="mb-12 bg-[#0b0c10]/70 border border-purple-950/35 rounded-2xl p-5 shadow-2xl backdrop-blur-md relative overflow-hidden">
          <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-purple-500 to-cyan-400" />
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 items-center font-mono">
            {/* Figure 1 */}
            <div className="space-y-1">
              <span className="text-[9px] uppercase tracking-widest text-slate-500 block font-bold">ACOUSTIC PRESSURE</span>
              <span className="text-sm font-black text-slate-100 block tracking-wide animate-pulse">
                {tickerMetrics.pressure} atm
              </span>
            </div>
            {/* Figure 2 */}
            <div className="space-y-1 border-l border-purple-950/20 pl-4 md:pl-6">
              <span className="text-[9px] uppercase tracking-widest text-slate-500 block font-bold">BUBBLE FLUX VELOCITY</span>
              <span className="text-sm font-black text-cyan-400 block tracking-wide">
                {tickerMetrics.velocity.toLocaleString()} m/s
              </span>
            </div>
            {/* Figure 3 */}
            <div className="space-y-1 border-l border-purple-950/20 pl-4 md:pl-6">
              <span className="text-[9px] uppercase tracking-widest text-slate-500 block font-bold">COLLAPSE CORE TEMP</span>
              <span className="text-sm font-black text-purple-400 block tracking-wide">
                {tickerMetrics.temp.toLocaleString()} K
              </span>
            </div>
            {/* Figure 4 */}
            <div className="space-y-1 border-l border-purple-950/20 pl-4 md:pl-6">
              <span className="text-[9px] uppercase tracking-widest text-slate-500 block font-bold">SOLANA LEDGER STEP</span>
              <span className="text-sm font-black text-emerald-400 block tracking-wide">
                BLOCK #{solanaBlock}
              </span>
            </div>
            {/* Figure 5 */}
            <div className="col-span-2 md:col-span-1 bg-slate-950/90 py-2.5 px-4 rounded-xl border border-purple-950/40 flex items-center justify-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping shrink-0" />
              <div className="text-[9px] text-slate-450 uppercase leading-none text-left">
                <span className="text-emerald-400 font-bold block">PORT ONLINE</span>
                <span className="text-slate-500 mt-0.5 block">SECURITY RATIFIED</span>
              </div>
            </div>
          </div>
        </section>

        {/* Phase 2: What Is Sonoluminescence? */}
        <section id="what-is-sono" className="mb-20 pt-8 border-t border-purple-950/10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            
            {/* Left: CavitationAnimation */}
            <div className="lg:col-span-5 w-full">
              <CavitationAnimation />
            </div>

            {/* Right: Explanatory Copy block */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className="space-y-2">
                <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-purple-400 font-extrabold block">
                  Fundamental Physics
                </span>
                <h2 className="font-display text-4xl font-extrabold text-white tracking-tight">
                  What Is Sonoluminescence?
                </h2>
              </div>

              {/* Outstanding Large Highlight Quote Line */}
              <p className="text-lg md:text-xl font-display font-semibold text-cyan-300 leading-snug">
                “Tiny bubbles can emit flashes of light when compressed by sound waves.”
              </p>

              {/* Standard physics rationale bodies */}
              <div className="space-y-4 text-xs text-slate-400 leading-relaxed font-sans mt-4">
                <p>
                  Scientists still study this phenomenon because it may reveal new insights into extreme energy density, plasma physics, and high-energy thermodynamics. As acoustic soundwaves pressure gas inclusions inside water vessels, the bubble undergoes a volumetric collapse that compresses the gas adiabatically, scaling temperatures beyond 15,000 Kelvin within a fraction of a microsecond.
                </p>
                <p>
                  This sudden extreme compression triggers intense ionization of trapped noble gas atoms, releasing a coherent ultraviolet stellar-like photonic spark known to physics as <em>Single-Bubble Sonoluminescence (SBSL)</em>.
                </p>
                <p className="border-l-2 border-purple-500/50 pl-4 py-1.5 text-slate-300 font-medium font-sans">
                  <strong>SONO</strong> helps fund this high-priority research through transparent, decentralized, or verified on-chain infrastructure, bypassing classical academic funding delays.
                </p>
              </div>

              <div className="pt-2 flex items-center gap-3">
                <span className="font-mono text-[9px] bg-slate-950 px-2.5 py-1 rounded border border-purple-950/40 text-emerald-400 font-bold">
                  LEDGER PROOF: VERIFIED
                </span>
                <span className="font-mono text-[9px] text-slate-500">
                  REF: PHYSICS REVIEWS LETTERS [SEC ID 18A-92]
                </span>
              </div>
            </div>

          </div>
        </section>

        {/* Bio-Acoustic Infographics & Exhibition Posters Section */}
        <section id="exhibition-gallery" className="mb-20 pt-10 border-t border-purple-950/10">
          <div className="text-center mb-10 space-y-3">
            <span className="font-mono text-[9.5px] uppercase tracking-[0.2em] justify-center inline-flex items-center gap-1.5 text-cyan-400 bg-cyan-950/25 px-3 py-1.5 rounded-full border border-cyan-550/30 font-black">
              <Eye className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
              PHYSICAL EXHIBITION GALLERY
            </span>
            <h2 className="font-display text-3xl font-black text-white uppercase tracking-wider">
              Mantis Shrimp &amp; Sonoluminescence Core Diagrams
            </h2>
            <p className="text-xs text-slate-400 leading-relaxed max-w-xl mx-auto">
              Inspect the exact research infographics linking advanced fluid cavitation physics with biological sonar. Click to open each poster in full-screen technical detail.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
            
            {/* Poster 1 CARD: Scientific Sonoluminescence Poster */}
            <div className="bg-[#0b0c10]/90 border border-purple-950/40 rounded-3xl overflow-hidden flex flex-col justify-between shadow-2xl relative group hover:border-purple-500/20 transition duration-300">
              <div className="absolute top-4 left-4 z-20 font-mono text-[8px] bg-purple-950/80 text-purple-300 px-2.5 py-1 rounded-full border border-purple-500/20 font-black tracking-widest uppercase">
                DIAGRAM ALPHA: SOUND CREATING LIGHT
              </div>

              {/* Poster 1 Body wrapper */}
              <div>
                {/* Poster 1 Image Frame */}
                <div 
                  onClick={() => setSelectedPoster('poster1')}
                  className="aspect-[4/3] w-full bg-slate-950 relative overflow-hidden cursor-zoom-in border-b border-purple-950/40 group-hover:opacity-95 transition"
                >
                  <img
                    src={scientificPoster1}
                    alt="Sonoluminescence - Sound Creating Light Scientific Poster"
                    className="w-full h-full object-cover select-none group-hover:scale-[1.02] transition duration-700"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-60 pointer-events-none" />
                  
                  {/* Floating Action Hint */}
                  <div className="absolute bottom-4 right-4 bg-[#0b0c10]/90 border border-purple-500/30 text-white font-mono text-[9px] px-3 py-1.5 rounded-xl flex items-center gap-1.5 shadow-lg group-hover:bg-purple-600 group-hover:border-purple-400 transition">
                    <span className="w-2 h-2 rounded-full bg-purple-400 group-hover:bg-white animate-pulse" />
                    <span>ZOOM POSTER</span>
                  </div>
                </div>

                {/* Poster 1 Text Context */}
                <div className="p-6 space-y-4 text-left">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-display text-lg font-extrabold text-white uppercase tracking-wider">
                        Sonoluminescence: Sound Creating Light
                      </h3>
                      <p className="text-[10px] text-purple-400 font-mono mt-0.5 tracking-wider uppercase font-semibold">
                        Acoustic Energy Focus &amp; Biological Hydrodynamics
                      </p>
                    </div>
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed italic border-l-2 border-purple-500/30 pl-3">
                    &quot;When pressure becomes purpose, the universe responds with light.&quot;
                  </p>

                  <p className="text-[11px] text-slate-450 leading-relaxed">
                    The mantis shrimp snaps its dactyl club with explosive speed, creating a cavitation bubble that collapses with extreme pressure. In that instant, the ocean produces a flash of light—sonoluminescence.
                  </p>

                  {/* Bullet points mimicking exact poster copy */}
                  <div className="grid grid-cols-2 gap-4 pt-2 text-[10.5px]">
                    <div className="space-y-2">
                      <strong className="font-mono text-[8.5px] text-purple-400 block tracking-widest uppercase">
                        THE MANTIS SHRIMP
                      </strong>
                      <ul className="space-y-1 text-slate-300">
                        <li className="flex items-center gap-1.5">
                          <span className="text-cyan-400">👁️</span> Sees beyond human range
                        </li>
                        <li className="flex items-center gap-1.5">
                          <span className="text-cyan-400">⚡</span> Strikes with hyper-velocity
                        </li>
                        <li className="flex items-center gap-1.5">
                          <span className="text-cyan-400">🌟</span> Creates light in darkness
                        </li>
                      </ul>
                    </div>

                    <div className="space-y-2">
                      <strong className="font-mono text-[8.5px] text-cyan-400 block tracking-widest uppercase">
                        THE PHENOMENON
                      </strong>
                      <ul className="space-y-1 text-slate-300">
                        <li className="flex items-center gap-1.5">
                          <span className="text-purple-400">1.</span> Shrimpcaster Strike
                        </li>
                        <li className="flex items-center gap-1.5">
                          <span className="text-purple-400">2.</span> Vapor Bubble Opens
                        </li>
                        <li className="flex items-center gap-1.5">
                          <span className="text-purple-400">3.</span> Adiabatic Bubble Collapse
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card Footer Equation */}
              <div className="mx-6 mb-6 p-3 rounded-xl bg-slate-950/60 border border-purple-950/30 flex items-center justify-between font-mono text-[9px] text-slate-400">
                <span>MATHEMATICAL RATIO:</span>
                <span className="text-purple-300 font-extrabold uppercase">
                  SOUND ＋ PRESSURE ＝ LIGHT 💡
                </span>
              </div>
            </div>

            {/* Poster 2 CARD: Holistic Bio-Acoustic Connection */}
            <div className="bg-[#0b0c10]/90 border border-cyan-950/40 rounded-3xl overflow-hidden flex flex-col justify-between shadow-2xl relative group hover:border-cyan-500/20 transition duration-300">
              <div className="absolute top-4 left-4 z-20 font-mono text-[8px] bg-cyan-950/80 text-cyan-300 px-2.5 py-1 rounded-full border border-cyan-500/20 font-black tracking-widest uppercase">
                DIAGRAM BETA: HARMONY OF SOUND &amp; LIGHT
              </div>

              {/* Poster 2 Body wrapper */}
              <div>
                {/* Poster 2 Image Frame */}
                <div 
                  onClick={() => setSelectedPoster('poster2')}
                  className="aspect-[4/3] w-full bg-slate-950 relative overflow-hidden cursor-zoom-in border-b border-cyan-950/40 group-hover:opacity-95 transition"
                >
                  <img
                    src={harmonyPoster2}
                    alt="The Person & Mantis Shrimp Harmony Poster"
                    className="w-full h-full object-cover select-none group-hover:scale-[1.02] transition duration-700"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-60 pointer-events-none" />
                  
                  {/* Floating Action Hint */}
                  <div className="absolute bottom-4 right-4 bg-[#0b0c10]/90 border border-cyan-500/30 text-white font-mono text-[9px] px-3 py-1.5 rounded-xl flex items-center gap-1.5 shadow-lg group-hover:bg-cyan-600 group-hover:border-cyan-400 transition">
                    <span className="w-2 h-2 rounded-full bg-cyan-400 group-hover:bg-white animate-pulse" />
                    <span>ZOOM POSTER</span>
                  </div>
                </div>

                {/* Poster 2 Text Context */}
                <div className="p-6 space-y-4 text-left">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-display text-lg font-extrabold text-white uppercase tracking-wider">
                        Bio-Acoustic Energy Resonance
                      </h3>
                      <p className="text-[10px] text-cyan-400 font-mono mt-0.5 tracking-wider uppercase font-semibold">
                        Micro-Energetics, Ocean Wave Guides, and inner-light
                      </p>
                    </div>
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed italic border-l-2 border-cyan-500/30 pl-3">
                    &quot;I am a listener. I am a creator. I turn pressure into purpose. I create light from within.&quot;
                  </p>

                  <p className="text-[11px] text-slate-450 leading-relaxed">
                    A holistic representation of energy transduction: the person absorbing the light of the sun, translating ocean vibrations, and emitting localized light. The wisdom of the ocean is captured in physical harmonics.
                  </p>

                  {/* Bullet points mimicking exact poster copy */}
                  <div className="grid grid-cols-2 gap-4 pt-2 text-[10.5px]">
                    <div className="space-y-2">
                      <strong className="font-mono text-[8.5px] text-cyan-400 block tracking-widest uppercase">
                        THE PERSON
                      </strong>
                      <ul className="space-y-1 text-slate-300">
                        <li className="flex items-center gap-1.5">
                          <span className="text-purple-400">☀️</span> Absorbs cosmic solar light
                        </li>
                        <li className="flex items-center gap-1.5">
                          <span className="text-purple-400">🌊</span> Listens like the ocean depth
                        </li>
                        <li className="flex items-center gap-1.5">
                          <span className="text-purple-400">💫</span> Translates pressure to purpose
                        </li>
                      </ul>
                    </div>

                    <div className="space-y-2">
                      <strong className="font-mono text-[8.5px] text-purple-400 block tracking-widest uppercase">
                        RESONANT PRINCIPLE
                      </strong>
                      <ul className="space-y-1 text-slate-300">
                        <li className="flex items-center gap-1.5">
                          <span className="text-cyan-400">⦿</span> Sound in the dark
                        </li>
                        <li className="flex items-center gap-1.5">
                          <span className="text-cyan-400">⦿</span> Microscopic solar sphere
                        </li>
                        <li className="flex items-center gap-1.5">
                          <span className="text-cyan-400">⦿</span> Inner illumination
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card Footer Equation */}
              <div className="mx-6 mb-6 p-3 rounded-xl bg-slate-950/60 border border-cyan-950/30 flex items-center justify-between font-mono text-[9px] text-slate-400">
                <span>PHILOSOPHY VECTOR:</span>
                <span className="text-cyan-300 font-extrabold uppercase">
                  OCEAN ENGINE ➔ ENERGY FORGED ➔ LIGHT RELEASED 🌊
                </span>
              </div>
            </div>

          </div>
        </section>

        {/* Phase 2.2: Research Mission */}
        <section id="research-mission" className="mb-20 pt-10 border-t border-purple-950/10">
          <div className="max-w-3xl mx-auto text-center mb-10 space-y-3">
            <span className="font-mono text-[9.5px] uppercase tracking-[0.2em] justify-center inline-flex items-center gap-1.5 text-purple-400 bg-purple-950/20 px-3 py-1.5 rounded-full border border-purple-900/30 font-black">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              CO-LAB EXPLORATION VECTORS
            </span>
            <h2 className="font-display text-3xl font-black text-white tracking-tight">
              Acoustic DeSci Funding Mission
            </h2>
            <p className="text-xs text-slate-400 leading-relaxed max-w-xl mx-auto">
              Our tokenized infrastructure bypasses gatekept institutional grants to stream real-time funding straight to cutting-edge physics labs researching vacuum fluid mechanics.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Pillar 1 */}
            <div className="bg-[#0b0c10]/70 border border-purple-950/35 relative overflow-hidden rounded-2xl p-6 shadow-xl transition-all hover:border-purple-900/40 group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-purple-500/5 to-transparent rounded-bl-full pointer-events-none" />
              <div className="p-2.5 w-10 h-10 rounded-xl bg-purple-950/50 border border-purple-900/35 flex items-center justify-center mb-4">
                <Activity className="w-5 h-5 text-purple-400" />
              </div>
              <h3 className="text-sm font-display font-extrabold text-white uppercase tracking-wider mb-2">
                1. Energy Density State
              </h3>
              <p className="text-xs text-slate-450 leading-relaxed font-sans mb-4">
                Quantifying the immense atmospheric pressure peak concentration as collapsing bubbles shrink down to nanometer limits under ultrasonic strain.
              </p>
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-[9px] font-mono">
                  <span className="text-slate-500 font-bold">UCLA FUNDING PROGRESS</span>
                  <span className="text-cyan-400 font-black">78% SYNCED</span>
                </div>
                <div className="h-1.5 bg-slate-950 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-purple-500 to-cyan-400 rounded-full animate-pulse" style={{ width: '78%' }} />
                </div>
              </div>
            </div>

            {/* Pillar 2 */}
            <div className="bg-[#0b0c10]/70 border border-purple-950/35 relative overflow-hidden rounded-2xl p-6 shadow-xl transition-all hover:border-purple-900/40 group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-indigo-500/5 to-transparent rounded-bl-full pointer-events-none" />
              <div className="p-2.5 w-10 h-10 rounded-xl bg-cyan-950/30 border border-cyan-900/40 flex items-center justify-center mb-4">
                <Cpu className="w-5 h-5 text-cyan-400" />
              </div>
              <h3 className="text-sm font-display font-extrabold text-white uppercase tracking-wider mb-2">
                2. Plasma Spectroscopy
              </h3>
              <p className="text-xs text-slate-450 leading-relaxed font-sans mb-4">
                Resolving real-time ionized gas light emission spectra for signatures of nuclear fusion or high temperature bremsstrahlung field peaks.
              </p>
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-[9px] font-mono">
                  <span className="text-slate-500 font-bold">UCLA FUNDING PROGRESS</span>
                  <span className="text-purple-400 font-black">64% SYNCED</span>
                </div>
                <div className="h-1.5 bg-slate-950 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-purple-500 to-cyan-400 rounded-full animate-pulse" style={{ width: '64%' }} />
                </div>
              </div>
            </div>

            {/* Pillar 3 */}
            <div className="bg-[#0b0c10]/70 border border-purple-950/35 relative overflow-hidden rounded-2xl p-6 shadow-xl transition-all hover:border-purple-900/40 group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-pink-500/5 to-transparent rounded-bl-full pointer-events-none" />
              <div className="p-2.5 w-10 h-10 rounded-xl bg-purple-950/50 border border-purple-900/35 flex items-center justify-center mb-4">
                <Compass className="w-5 h-5 text-rose-400" />
              </div>
              <h3 className="text-sm font-display font-extrabold text-white uppercase tracking-wider mb-2">
                3. Extreme Thermodynamics
              </h3>
              <p className="text-xs text-slate-450 leading-relaxed font-sans mb-4">
                Simulating molecular collisions inside localized temperature environments that easily surpass the solar surface corona thermal boundaries.
              </p>
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-[9px] font-mono">
                  <span className="text-slate-500 font-bold">UCLA FUNDING PROGRESS</span>
                  <span className="text-emerald-400 font-black">100% SECURED</span>
                </div>
                <div className="h-1.5 bg-slate-950 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full" style={{ width: '100%' }} />
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* Real-Time Telemetry Layer — "The Analemma Node" */}
        <section id="analemma-telemetry" className="mb-20 pt-10 border-t border-purple-950/10">
          <AnalemmaNodeTelemetry />
        </section>

        {/* 5. Telemetry Dashboard (Interactive Workspace) */}
        <section id="telemetry-dashboard" className="pt-10 border-t border-purple-950/10 mb-20">
          <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="font-display font-black text-xl uppercase tracking-widest text-[#d8b4fe]">
                Telemetry Dashboard
              </h3>
              <p className="text-xs text-slate-450 mt-1 uppercase tracking-wider font-mono">
                SIMULATION TUNING SUITE // SECURE CO-CELL REAL-TIME LINKS CONNECTED
              </p>
            </div>
            <div className="font-mono text-[9px] text-[#8b5cf6] bg-purple-950/30 px-3 py-1.5 rounded-lg border border-purple-900/30 font-bold">
              PORT 3000 STATUS: VERIFIED
            </div>
          </div>

          {/* Bento Grid layout containing Synth settings and terminal loggers */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Synthesizer Tuning Suite on Left */}
            <section className="lg:col-span-4 space-y-6 flex flex-col justify-stretch">
              
              {/* Sound Synthesis Block */}
              <div className="bg-[#0b0c10]/95 border border-purple-950/40 rounded-2xl p-5 shadow-2xl space-y-4 relative">
                <div className="absolute top-0 right-10 w-20 h-[1px] bg-cyan-400/50" />
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="p-1 rounded bg-[#160d2d] border border-purple-900/40">
                      <Radio className="w-4 h-4 text-purple-400" />
                    </div>
                    <div>
                      <h4 className="text-xs font-display font-semibold text-slate-200">
                        SONO Sound Generator
                      </h4>
                      <span className="font-mono text-[9px] text-slate-450 block uppercase">
                        Subtractive acoustic synth
                      </span>
                    </div>
                  </div>

                  {/* sound trigger slider */}
                  <button
                    id="synth-feed-toggle-btn"
                    onClick={toggleSound}
                    className={`px-3 py-1.5 rounded-lg border font-mono text-[10px] font-extrabold flex items-center gap-1.5 transition duration-200 shadow ${
                      audioActive 
                        ? 'bg-rose-950/60 border-rose-650 text-rose-300' 
                        : 'bg-emerald-950/60 border-emerald-650 text-emerald-300'
                    }`}
                  >
                    {audioActive ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                    <span>{audioActive ? 'MUTE DRONE' : 'ACTIVATE DRONE'}</span>
                  </button>
                </div>

                {/* Sub-Acoustic Scope Screen */}
                <div className="space-y-1.5">
                  <span className="font-mono text-[9.5px] text-slate-450 uppercase tracking-wide block">
                    Resonant Oscilloscope Screen
                  </span>
                  <div className="h-20 rounded-lg bg-slate-950 border border-purple-950/30 overflow-hidden relative">
                    <canvas
                      ref={audioCanvasRef}
                      width={320}
                      height={80}
                      className="w-full h-full block"
                    />
                    <div className="absolute left-2.5 top-1.5 font-mono text-[8px] text-cyan-400 px-1 py-0.5 rounded bg-slate-950/90 border border-purple-950/30 uppercase font-black">
                      FEED: {activeNode.codename}
                    </div>
                  </div>
                </div>

                {/* Master Volume Slider */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400 font-medium">Drone Master Gain</span>
                    <span className="font-mono text-[11px] text-cyan-300 font-bold">{audioVolume}%</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <VolumeX className="w-4 h-4 text-slate-500 shrink-0" />
                    <input
                      id="volume-slider-bar"
                      type="range"
                      min="0"
                      max="100"
                      step="5"
                      value={audioVolume}
                      onChange={(e) => setAudioVolume(parseInt(e.target.value))}
                      className="flex-1 accent-cyan-400 h-1 bg-slate-800 rounded-lg cursor-pointer appearance-none"
                      aria-label="Synthesizer Master Gain volume slider"
                    />
                    <Volume2 className="w-4 h-4 text-slate-500 shrink-0" />
                  </div>
                </div>

                <div className="text-[10px] text-slate-500 font-mono leading-relaxed bg-slate-950/50 p-2.5 rounded-lg border border-purple-950/20">
                  ⚡ <strong className="text-slate-300">INTERACTIVE SWEEPS:</strong> Sliders feed immediate physical parameters directly into the synthesizer node envelope.
                </div>
              </div>

              {/* Quick Preset Swaps Block */}
              <div className="bg-[#0b0c10]/95 border border-purple-950/40 rounded-2xl p-5 shadow-2xl space-y-4">
                <div className="flex items-center gap-2">
                  <div className="p-1 rounded bg-[#0d2122] border border-cyan-900/40">
                    <Compass className="w-4 h-4 text-cyan-400" />
                  </div>
                  <div>
                    <h4 className="text-xs font-display font-semibold text-slate-200">
                      Vacuum Lab Presets
                    </h4>
                    <span className="font-mono text-[9px] text-slate-450 block uppercase">
                      Instant Cavitation Overlays
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  {/* Preset 1 */}
                  <button
                    id="preset-storm-btn"
                    onClick={() => triggerPreset('solar-storm')}
                    className="w-full text-left p-3 rounded-xl bg-slate-950/70 hover:bg-slate-900/90 border border-purple-950/25 hover:border-purple-900/50 transition flex items-center justify-between group"
                  >
                    <div className="space-y-0.5">
                      <span className="text-xs font-bold text-rose-300 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                        Solar Storm Peak
                      </span>
                      <span className="font-mono text-[9px] text-slate-450 block">432 Hz // EXC_11 // RES_75</span>
                    </div>
                    <span className="text-slate-600 group-hover:text-rose-400 text-xs transition font-mono font-bold">&gt;&gt; LINK</span>
                  </button>

                  {/* Preset 2 */}
                  <button
                    id="preset-magnetic-btn"
                    onClick={() => triggerPreset('super-magnetic')}
                    className="w-full text-left p-3 rounded-xl bg-slate-950/70 hover:bg-slate-900/90 border border-purple-950/25 hover:border-purple-900/50 transition flex items-center justify-between group"
                  >
                    <div className="space-y-0.5">
                      <span className="text-xs font-bold text-cyan-300 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                        Magnetic Nadir Flux
                      </span>
                      <span className="font-mono text-[9px] text-slate-450 block">528 Hz // EXC_8 // RES_40</span>
                    </div>
                    <span className="text-slate-600 group-hover:text-cyan-400 text-xs transition font-mono font-bold">&gt;&gt; LINK</span>
                  </button>

                  {/* Preset 3 */}
                  <button
                    id="preset-violet-btn"
                    onClick={() => triggerPreset('violet-chaos')}
                    className="w-full text-left p-3 rounded-xl bg-slate-950/70 hover:bg-slate-900/90 border border-purple-950/25 hover:border-purple-900/50 transition flex items-center justify-between group"
                  >
                    <div className="space-y-0.5">
                      <span className="text-xs font-bold text-purple-300 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                        Luminescence Sweep
                      </span>
                      <span className="font-mono text-[9px] text-slate-450 block">639 Hz // EXC_15 // RES_90</span>
                    </div>
                    <span className="text-slate-600 group-hover:text-purple-400 text-xs transition font-mono font-bold">&gt;&gt; LINK</span>
                  </button>
                </div>
              </div>
            </section>

            {/* Live nodes cards description block on Right */}
            <section id="telemetry-nodes-section" className="lg:col-span-8 space-y-6">
              <div className="bg-[#0b0c10]/80 border border-purple-950/30 rounded-2xl p-6 shadow-2xl">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 border-b border-purple-950/20 pb-4">
                  <div className="flex items-center gap-2">
                    <span className="p-1 rounded bg-[#0f211d] border border-emerald-900/30">
                      <Layers className="w-4 h-4 text-emerald-400" />
                    </span>
                    <div>
                      <h4 className="text-sm font-display font-semibold text-slate-100 uppercase tracking-widest">
                        Sonoluminescence Telemetry Nodes
                      </h4>
                      <span className="font-mono text-[9px] uppercase tracking-wider text-slate-450 block">
                        Select and sync any active node bellow for diagnostic capture
                      </span>
                    </div>
                  </div>
                  
                  <div className="font-mono text-[10px] text-cyan-400 bg-slate-950 px-3 py-1.5 border border-purple-950/35 rounded-lg">
                    LINKED CO-CELL: <strong className="font-bold uppercase text-white">{activeNode.codename}</strong>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {nodes.map((node) => (
                    <TelemetryNodeCard
                      key={node.id}
                      node={node}
                      isActive={node.id === activeNodeId}
                      onSelect={handleSelectNode}
                      speedMultiplier={params.speed}
                      excitation={params.excitation}
                    />
                  ))}
                </div>

                {/* Selected Node Description Label */}
                <div className="mt-6 p-4 rounded-xl bg-slate-950/90 border border-purple-950/35 font-sans text-xs text-slate-400 leading-relaxed">
                  📢 <strong className="text-cyan-400 uppercase font-mono text-[10px] tracking-wider bg-[#10101b] border border-purple-950/30 px-2 py-0.5 rounded mr-1">
                    Active Node Metadata ({activeNode.codename}):
                  </strong> {activeNode.description}
                </div>
              </div>

              {/* Interactive Technical Terminal (Anchor targets block) */}
              <div id="terminal-section">
                <TechnicalTerminal
                  logs={logs}
                  setLogs={setLogs}
                  onExecuteCommand={executeTerminalCommand}
                />
              </div>
            </section>

          </div>
        </section>

        {/* Phase 2.3: Tokenomics Section */}
        <section id="tokenomics" className="pt-10 border-t border-purple-950/10 mb-12">
          
          <div className="mb-10 text-center space-y-3">
            <span className="font-mono text-[9.5px] uppercase tracking-[0.2em] inline-flex items-center gap-1.5 text-cyan-400 bg-cyan-950/20 px-3 py-1.5 rounded-full border border-cyan-900/40 font-black">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
              SOLANA DECENTRALIZED SCHOLARSHIP LEDGER
            </span>
            <h2 className="font-display text-4xl font-extrabold text-white tracking-tight">
              SONO Tokenomics
            </h2>
            <p className="text-xs text-slate-400 max-w-xl mx-auto leading-relaxed">
              Transparent distribution built on high-throughput Solana infrastructure. Heavy emphasis on our core competitive advantage: automated, institutional research locks.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-[#0b0c10]/45 border border-purple-950/30 p-8 rounded-3xl backdrop-blur-sm">
            
            {/* Left Column: Interactive Layout-matching Allocations Pie-SVG graph */}
            <div className="lg:col-span-4 flex flex-col items-center justify-center p-4 border border-purple-950/20 bg-slate-950/50 rounded-2xl relative">
              <div className="absolute top-2 left-3 font-mono text-[8.5px] text-slate-500 uppercase">
                Macro Allocation Model
              </div>
              
              <svg viewBox="0 0 160 160" className="w-48 h-48 drop-shadow-[0_0_15px_rgba(168,85,247,0.15)] mt-4">
                {/* Outermost ring: Public Pre-Launch Strategic Round (35%) */}
                <circle cx="80" cy="80" r="65" fill="none" stroke="#22d3ee" strokeWidth="8" strokeDasharray="143 265" strokeLinecap="round" transform="rotate(-90 80 80)" />
                {/* Second ring: Institutional Research Endowment (25%) */}
                <circle cx="80" cy="80" r="50" fill="none" stroke="#a855f7" strokeWidth="8" strokeDasharray="102 306" strokeLinecap="round" transform="rotate(36 80 80)" />
                {/* Third ring: Operational & Ecosystem Treasury (25%) */}
                <circle cx="80" cy="80" r="35" fill="none" stroke="#ec4899" strokeWidth="8" strokeDasharray="102 306" strokeLinecap="round" transform="rotate(126 80 80)" />
                {/* Central Core: Core Founders & Launch Team (15%) */}
                <circle cx="80" cy="80" r="20" fill="none" stroke="#f59e0b" strokeWidth="8" strokeDasharray="61 107" strokeLinecap="round" transform="rotate(216 80 80)" />
                
                {/* Small central bubble */}
                <circle cx="80" cy="80" r="8" fill="#0B0C10" />
              </svg>

              <div className="mt-4 w-full grid grid-cols-2 gap-2 text-left font-mono text-[8px] text-slate-500 border-t border-purple-950/20 pt-4 px-1">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#22d3ee]" />
                  <span>35% PUBLIC ROUND</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#a855f7]" />
                  <span>25% RESEARCH LOCKS</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#ec4899]" />
                  <span>25% ECOSYSTEM TREASURY</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#f59e0b]" />
                  <span>15% FOUNDERS/TEAM</span>
                </div>
              </div>
            </div>

            {/* Right Column: Descriptions list */}
            <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Allocation 1: Institutional Research Endowment */}
              <div className="bg-slate-950/90 border border-purple-950/25 p-4 rounded-xl flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-black text-[#a855f7] font-display uppercase tracking-widest">
                      Research Endowment
                    </span>
                    <span className="font-mono text-xs font-extrabold text-[#d8b4fe]">25% LEVEL</span>
                  </div>
                  <p className="text-[10px] text-slate-450 leading-relaxed font-sans">
                    Locked via Streamflow to fund the UCLA physics tracks through The Giving Block. Programmatic, milestone-released distributions ensure compliance and research continuity.
                  </p>
                </div>
                <div className="mt-3 text-[9px] font-mono text-purple-400 uppercase font-bold flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
                  STATUS: STREAMFLOW ESCROW LOCKED
                </div>
              </div>

              {/* Allocation 2: Operational & Ecosystem Treasury */}
              <div className="bg-slate-950/90 border border-purple-950/25 p-4 rounded-xl flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-black text-[#ec4899] font-display uppercase tracking-widest">
                      Ecosystem Treasury
                    </span>
                    <span className="font-mono text-xs font-extrabold text-pink-405">25% LEVEL</span>
                  </div>
                  <p className="text-[10px] text-slate-450 leading-relaxed font-sans">
                    Reserved for platform upgrades, liquidity pools, telemetry data pipelines, hardware instrumentation, and decentralized scientific database infrastructure.
                  </p>
                </div>
                <div className="mt-3 text-[9px] font-mono text-pink-400 uppercase font-bold flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-pink-400" />
                  STATUS: MULTISIG TREASURY SECURED
                </div>
              </div>

              {/* Allocation 3: Public Pre-Launch Strategic Round */}
              <div className="bg-slate-950/90 border border-purple-950/25 p-4 rounded-xl flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-black text-[#22d3ee] font-display uppercase tracking-widest">
                      Public Pre-Launch
                    </span>
                    <span className="font-mono text-xs font-extrabold text-cyan-405">35% LEVEL</span>
                  </div>
                  <p className="text-[10px] text-slate-450 leading-relaxed font-sans">
                    Distributed to our public community, backers, academic research supporters, and early lab terminal participants to incentivize wide-scale telemetry access.
                  </p>
                </div>
                <div className="mt-3 text-[9px] font-mono text-cyan-400 uppercase font-bold flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                  STATUS: COMMUNITY ROUNDS ACTIVE
                </div>
              </div>

              {/* Allocation 4: Core Founders & Launch Team */}
              <div className="bg-slate-950/90 border border-purple-950/25 p-4 rounded-xl flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-black text-[#f59e0b] font-display uppercase tracking-widest">
                      Founders & Team
                    </span>
                    <span className="font-mono text-xs font-extrabold text-amber-500">15% LEVEL</span>
                  </div>
                  <p className="text-[10px] text-slate-450 leading-relaxed font-sans">
                    Subject to strict linear vesting schedules to align developers, physicists, and collaborators with long-term sonoluminescence DeSci breakthroughs.
                  </p>
                </div>
                <div className="mt-3 text-[9px] font-mono text-amber-500 uppercase font-bold flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                  STATUS: 24-MONTH VESTING
                </div>
              </div>

            </div>
          </div>

          {/* Strict Automated Framework Flow Diagram */}
          <div className="mt-8 border border-purple-950/30 bg-slate-950/60 p-6 rounded-3xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-[1.5px] bg-gradient-to-r from-transparent via-cyan-400/30 to-purple-400/20" />
            
            <h3 className="font-display text-sm font-bold text-slate-200 tracking-wider mb-2 uppercase">
              Automated Institutional Research Flow
            </h3>
            <p className="text-[11px] text-slate-400 mb-6 leading-relaxed max-w-2xl font-sans">
              To ensure total legitimacy, the <strong className="text-purple-300">25% Institutional Research allocation</strong> operates under a strict, automated escrow framework integrating time-locked releases and zero-slippage research settlement tracks:
            </p>

            {/* FLOW VISUALIZER CARS */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center justify-center relative font-mono text-[10px] md:text-[11px]">
              
              {/* Step 1 */}
              <div className="bg-[#0b0c10]/95 border border-purple-500/30 p-4 rounded-xl text-center flex flex-col items-center justify-center min-h-[90px] relative z-10 hover:border-purple-400 transition shadow-lg">
                <span className="text-[8px] text-purple-400 font-bold block mb-1">ALLOCATION SOURCE</span>
                <span className="font-display text-white font-black text-xs">25% Research Allocation</span>
                <span className="text-[8px] text-slate-500 mt-1 uppercase">250,000,000 $SONO</span>
              </div>

              {/* Arrow / Line 1 */}
              <div className="hidden md:flex flex-col items-center justify-center text-cyan-400 whitespace-nowrap">
                <span className="animate-pulse">──▶</span>
                <span className="text-[7px] text-slate-500 uppercase mt-0.5">Escrow Lock</span>
              </div>

              {/* Step 2 */}
              <div className="bg-[#0b0c10]/95 border border-cyan-500/30 p-4 rounded-xl text-center flex flex-col items-center justify-center min-h-[90px] relative z-10 hover:border-cyan-400 transition shadow-lg">
                <span className="text-[8px] text-cyan-400 font-bold block mb-1">ESCROW REGULATOR</span>
                <span className="font-display text-white font-black text-[10px] leading-tight">Streamflow Escrow Contract</span>
                <span className="text-[7px] text-slate-450 mt-1">Time-locked & milestone-released</span>
              </div>

              {/* Arrow / Line 2 */}
              <div className="hidden md:flex flex-col items-center justify-center text-purple-400 whitespace-nowrap">
                <span className="animate-pulse">──▶</span>
                <span className="text-[7px] text-slate-500 uppercase mt-0.5">Charity Swap</span>
              </div>

              {/* Step 3 */}
              <div className="bg-[#0b0c10]/95 border border-pink-500/30 p-4 rounded-xl text-center flex flex-col items-center justify-center min-h-[90px] relative z-10 hover:border-pink-400 transition shadow-lg">
                <span className="text-[8px] text-pink-400 font-bold block mb-1">CONVERSION GATEWAY</span>
                <span className="font-display text-white font-bold text-[10px]">The Giving Block</span>
                <span className="text-[7px] text-slate-450 mt-1">Automated, zero-slippage conversion</span>
              </div>

              {/* Arrow / Line 3 */}
              <div className="hidden md:flex flex-col items-center justify-center text-emerald-400 whitespace-nowrap">
                <span className="animate-pulse">──▶</span>
                <span className="text-[7px] text-slate-500 uppercase mt-0.5">Settlement</span>
              </div>

              {/* Step 4 */}
              <div className="bg-[#0b0c10]/95 border border-emerald-500/30 p-4 rounded-xl text-center flex flex-col items-center justify-center min-h-[90px] relative z-10 hover:border-emerald-400 transition shadow-lg">
                <span className="text-[8px] text-emerald-400 font-bold block mb-1">ACADEMIC DESTINATION</span>
                <span className="font-display text-white font-black text-[9.5px] leading-snug">UCLA University Advancement</span>
                <span className="text-[7px] text-emerald-400/90 mt-1 uppercase font-semibold">Endpoint Confirmed</span>
              </div>

            </div>

            {/* Strict Lockup Descriptions List */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-8 pt-6 border-t border-purple-950/35">
              <div className="p-4 rounded-2xl bg-[#0b0c10]/50 border border-purple-500/10 hover:border-purple-500/25 transition">
                <div className="flex items-center gap-1.5 mb-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                  <h4 className="font-display text-[10.5px] font-extrabold text-purple-300 uppercase tracking-wider">
                    The Lockup
                  </h4>
                </div>
                <p className="text-[10px] text-slate-400 leading-relaxed font-sans">
                  The tokens sit in a multi-signature smart contract managed by <strong className="text-white">Streamflow Finance</strong>. They cannot be dumped onto the open market, guaranteeing deep structural pool integrity.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#0b0c10]/50 border border-cyan-500/10 hover:border-cyan-500/25 transition">
                <div className="flex items-center gap-1.5 mb-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                  <h4 className="font-display text-[10.5px] font-extrabold text-cyan-300 uppercase tracking-wider">
                    The Streaming Mechanics
                  </h4>
                </div>
                <p className="text-[10px] text-slate-400 leading-relaxed font-sans">
                  As milestones are verified (<strong className="text-white">e.g., streaming new live data from the laboratory to your website terminal</strong>), small portions of this allocation unlock programmatically.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#0b0c10]/50 border border-pink-500/10 hover:border-pink-500/25 transition">
                <div className="flex items-center gap-1.5 mb-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-pink-400" />
                  <h4 className="font-display text-[10.5px] font-extrabold text-pink-300 uppercase tracking-wider">
                    The Frictionless Off-Ramp
                  </h4>
                </div>
                <p className="text-[10px] text-slate-400 leading-relaxed font-sans">
                  The unlocked tokens route through <strong className="text-white">The Giving Block</strong>, instantly converting your ecosystem assets into USDC or cash without market friction or slippage. The university foundation receives clean, institutional-grade fiat or stablecoins directly.
                </p>
              </div>
            </div>

          </div>

          {/* Tokenomics Responsive Table Schedule */}
          <div className="tokenomics-wrapper mt-8">
            <table className="tokenomics-table font-sans">
              <thead>
                <tr>
                  <th className="font-mono text-[10px]">Allocation</th>
                  <th className="font-mono text-[10px]">Vault Type</th>
                  <th className="font-mono text-[10px]">Schedule</th>
                  <th className="font-mono text-[10px]">Target</th>
                </tr>
              </thead>
              <tbody className="text-slate-300 font-mono text-xs">
                <tr className="hover:bg-purple-950/5">
                  <td className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">25%</td>
                  <td>Streamflow Escrow</td>
                  <td>Time-locked & Milestone-released</td>
                  <td className="text-purple-400 font-semibold">UCLA Institutional Research Endowment</td>
                </tr>
                <tr className="hover:bg-purple-950/5">
                  <td className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">25%</td>
                  <td>Ecosystem Treasury</td>
                  <td>Platform & Infrastructure Reserve</td>
                  <td className="text-cyan-400 font-semibold">Operational & Ecosystem Treasury</td>
                </tr>
                <tr className="hover:bg-purple-950/5">
                  <td className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">35%</td>
                  <td>Public Escrow</td>
                  <td>Strategic Pre-Launch Release</td>
                  <td className="text-pink-400 font-semibold">Public Pre-Launch Strategic Round</td>
                </tr>
                <tr className="hover:bg-purple-950/5">
                  <td className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">15%</td>
                  <td>Linear Escrow Team Vault</td>
                  <td>24mo Vesting / 6mo cliff</td>
                  <td className="text-amber-500 font-semibold">Core Founders & Launch Team</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Secure Solana contract details badge */}
          <div className="mt-6 p-4 rounded-xl bg-slate-950 border border-purple-950/30 flex items-center justify-center gap-3 font-mono">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
              <div className="text-[9px] text-slate-400 leading-tight">
                <span className="font-bold block text-center">1,000,000,000 SPL SUPPLY RATIFIED</span>
                <span className="text-[8px] text-slate-500 block text-center">AUTHORITY LOCKED // MULTISIG ENFORCED</span>
              </div>
            </div>
          </div>

        </section>

        {/* On-Chain Strategic DeSci Project Roadmap */}
        <section id="roadmap" className="mt-24 pt-12 border-t border-purple-950/15 mb-10">
          <div className="text-center mb-12 relative">
            <div className="absolute top-[-20px] left-1/2 transform -translate-x-1/2 font-mono text-[8.5px] text-cyan-400 tracking-[0.2em] uppercase">
              DESCENTRALIZED MISSION BLUEPRINT
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-black text-white uppercase tracking-wider">
              Strategic Roadmap
            </h2>
            <p className="text-xs text-slate-450 max-w-xl mx-auto leading-relaxed mt-1">
              Transitioning from viral public community alignment into a fully compliant on-chain multi-node decentralized science network.
            </p>
          </div>

          <div className="relative grid grid-cols-1 md:grid-cols-4 gap-6 items-stretch">
            {/* Connecting background glowing line for desktop */}
            <div className="hidden md:block absolute top-[44px] left-4 right-4 h-[1.5px] bg-gradient-to-r from-cyan-400/20 via-purple-500/30 via-pink-500/30 to-emerald-400/10 z-0" />

            {/* Phase 1 */}
            <div className="bg-[#0b0c10]/95 border border-cyan-500/15 p-5 rounded-2xl relative flex flex-col justify-between hover:border-cyan-400/40 transition z-10 shadow-xl">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-full bg-cyan-950/40 border border-cyan-500/30 flex items-center justify-center text-xs font-mono font-black text-cyan-400 uppercase">
                    P1
                  </div>
                  <div>
                    <span className="font-mono text-[8.5px] text-slate-500 block tracking-widest uppercase">Q1 - Q2</span>
                    <h4 className="font-display text-xs font-extrabold text-white uppercase tracking-wider leading-none">
                      The Activation
                    </h4>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="p-2 rounded-lg bg-slate-950/50 border border-purple-950/20">
                    <strong className="text-[9px] uppercase font-mono text-cyan-400 block mb-0.5">Focus:</strong>
                    <p className="text-[10px] text-slate-400 leading-normal font-sans">
                      Branding alignment, community expansion, and strategic team recruitment.
                    </p>
                  </div>

                  <div className="space-y-2 border-t border-purple-950/15 pt-2 font-sans text-[10px] text-slate-400 leading-relaxed">
                    <p>
                      🌐 <strong className="text-slate-200">Brand Geometry:</strong> Formally launch the public frontend terminal linking cosmic analemma geometry to acoustic sonoluminescence physics.
                    </p>
                    <p>
                      🎬 <strong className="text-slate-200">The Media Push:</strong> Execute the &quot;Real Science&quot; video series across TikTok to capture public attention and build organic community funnels.
                    </p>
                    <p>
                      👥 <strong className="text-slate-200">Recruitment:</strong> Onboard physics engineers &amp; developers via Solana collectives (Superteam / Lamport DAO) to secure key leads.
                    </p>
                    <p>
                      📊 <strong className="text-slate-200">Pre-Launch Indexing:</strong> Submit official documentation for pre-launch preview tracking on CoinGecko.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-purple-950/15 flex items-center justify-between text-[8px] font-mono font-extrabold uppercase text-cyan-400">
                <span>STATUS: ARCHIVED</span>
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
              </div>
            </div>

            {/* Phase 2: Institutional Convergence */}
            <div className="bg-[#0b0c10]/95 border border-purple-500/30 p-5 rounded-2xl relative flex flex-col justify-between hover:border-purple-400/50 transition z-10 shadow-xl shadow-purple-500/5">
              <div className="absolute top-2 right-3 font-mono text-[8px] text-purple-400 bg-purple-950/40 px-1.5 py-0.5 rounded border border-purple-900/30 font-bold uppercase animate-pulse">
                Current
              </div>
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-full bg-purple-950/40 border border-purple-500/30 flex items-center justify-center text-xs font-mono font-black text-purple-400 uppercase">
                    P2
                  </div>
                  <div>
                    <span className="font-mono text-[8.5px] text-slate-500 block tracking-widest uppercase">Q3</span>
                    <h4 className="font-display text-xs font-extrabold text-white uppercase tracking-wider leading-none">
                      Convergence
                    </h4>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="p-2 rounded-lg bg-slate-950/50 border border-purple-950/20">
                    <strong className="text-[9px] uppercase font-mono text-purple-300 block mb-0.5">Focus:</strong>
                    <p className="text-[10px] text-slate-400 leading-normal font-sans">
                      Legal frameworks, university outreach, and smart contract setup.
                    </p>
                  </div>

                  <div className="space-y-2 border-t border-purple-950/15 pt-2 font-sans text-[10px] text-slate-400 leading-relaxed">
                    <p>
                      🏢 <strong className="text-slate-200">UCLA Outreach:</strong> Establish communications with the UCLA Physics &amp; Astronomy department advancement desk.
                    </p>
                    <p>
                      ⚖️ <strong className="text-slate-200">Compliance Setup:</strong> Partner with The Giving Block to ensure frictionless, zero-slippage USDC conversion models.
                    </p>
                    <p>
                      📜 <strong className="text-slate-200">Escrow Deployment:</strong> Lock 25% Institutional Research Endowment into automated smart contract escrows via Streamflow.
                    </p>
                    <p>
                      📝 <strong className="text-slate-200">Grant Submission:</strong> Submit finalized $SONO application to the Solana Foundation with technical wireframes.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-purple-950/15 flex items-center justify-between text-[8px] font-mono font-extrabold uppercase text-purple-450">
                <span>STATUS: ACTIVE</span>
                <span className="w-1.5 h-1.5 rounded-full bg-purple-450 animate-pulse" />
              </div>
            </div>

            {/* Phase 3 */}
            <div className="bg-[#0b0c10]/95 border border-pink-500/15 p-5 rounded-2xl relative flex flex-col justify-between hover:border-pink-400/40 transition z-10 shadow-xl">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-full bg-pink-950/40 border border-pink-500/30 flex items-center justify-center text-xs font-mono font-black text-pink-400 uppercase">
                    P3
                  </div>
                  <div>
                    <span className="font-mono text-[8.5px] text-slate-500 block tracking-widest uppercase">Q4</span>
                    <h4 className="font-display text-xs font-extrabold text-white uppercase tracking-wider leading-none">
                      Data Stream
                    </h4>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="p-2 rounded-lg bg-slate-950/50 border border-purple-950/20">
                    <strong className="text-[9px] uppercase font-mono text-pink-400 block mb-0.5">Focus:</strong>
                    <p className="text-[10px] text-slate-400 leading-normal font-sans">
                      Token launch, technical integration, and live telemetry.
                    </p>
                  </div>

                  <div className="space-y-2 border-t border-purple-950/15 pt-2 font-sans text-[10px] text-slate-400 leading-relaxed">
                    <p>
                      🪙 <strong className="text-slate-200">Token Launch (TGE):</strong> Publicly launch $SONO utility token to decentralize governance and fund ecosystem.
                    </p>
                    <p>
                      📡 <strong className="text-slate-200">Physics Terminal:</strong> Connect full-stack pipelines to feed real acoustic laboratory transducer metrics to terminal UI.
                    </p>
                    <p>
                      🤝 <strong className="text-slate-200">SRA Execution:</strong> Sign Sponsored Research Agreement triggering first milestone escrow releases.
                    </p>
                    <p>
                      📰 <strong className="text-slate-200">Media Spotlight:</strong> Pitch key tech/Web3 outlets (CoinDesk) showcasing the compliance blueprint.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-purple-950/15 flex items-center justify-between text-[8px] font-mono font-extrabold uppercase text-slate-500">
                <span>STATUS: QUEUED</span>
                <span className="w-1.5 h-1.5 rounded-full bg-slate-800" />
              </div>
            </div>

            {/* Phase 4 */}
            <div className="bg-[#0b0c10]/95 border border-emerald-500/15 p-5 rounded-2xl relative flex flex-col justify-between hover:border-emerald-400/40 transition z-10 shadow-xl">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-950/40 border border-emerald-500/30 flex items-center justify-center text-xs font-mono font-black text-emerald-400 uppercase">
                    P4
                  </div>
                  <div>
                    <span className="font-mono text-[8.5px] text-slate-500 block tracking-widest uppercase">BEYOND</span>
                    <h4 className="font-display text-xs font-extrabold text-white uppercase tracking-wider leading-none">
                      Expansion
                    </h4>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="p-2 rounded-lg bg-slate-950/50 border border-purple-950/20">
                    <strong className="text-[9px] uppercase font-mono text-emerald-400 block mb-0.5">Focus:</strong>
                    <p className="text-[10px] text-slate-400 leading-normal font-sans">
                      Scaling to global decentralized physical research tracks.
                    </p>
                  </div>

                  <div className="space-y-2 border-t border-purple-950/15 pt-2 font-sans text-[10px] text-slate-400 leading-relaxed">
                    <p>
                      ⚛️ <strong className="text-slate-200">Node Expansion:</strong> Scale funding templates to Pyroelectric Crystal Fusion Tracks.
                    </p>
                    <p>
                      📖 <strong className="text-slate-200">Open-Access Pubs:</strong> Launch peer-reviewed repository recording metrics on-chain permanently.
                    </p>
                    <p>
                      🗺️ <strong className="text-slate-200">Global Labs:</strong> Replicate UCLA template to fund acoustic cavitation labs globally.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-purple-950/15 flex items-center justify-between text-[8px] font-mono font-extrabold uppercase text-slate-500">
                <span>STATUS: STRATEGIC</span>
                <span className="w-1.5 h-1.5 rounded-full bg-slate-800" />
              </div>
            </div>

          </div>
        </section>

      </main>

      {/* Discrete bottom technical details credit */}
      <footer className="border-t border-purple-950/25 mt-16 py-8 bg-[#04040a]/90 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4 text-center">
          <p className="font-mono text-[10px] text-slate-500">
            S O N O L U M I N E S C E N C E &copy; 2026 // CO-AUTHORED BY UCLA DESCI LABS. 
          </p>
          <div className="flex items-center gap-3 font-mono text-[10px] text-slate-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>PORT 3000 CONNECTION SECURE // SOLANA ON-CHAIN STATUS RATIFIED</span>
          </div>
        </div>
      </footer>

      {/* Scientific & Bio-Acoustic Poster Lightbox Zoom Modal */}
      {selectedPoster && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10 bg-black/95 backdrop-blur-md transition-all duration-300"
          onClick={() => setSelectedPoster(null)}
        >
          <div 
            className="bg-[#0b0c10] border border-cyan-500/30 rounded-3xl max-w-5xl w-full max-h-[90vh] overflow-hidden shadow-2xl flex flex-col md:flex-row relative animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button absolute top corner */}
            <button
              onClick={() => setSelectedPoster(null)}
              className="absolute top-4 right-4 z-40 p-2.5 rounded-full bg-black/85 border border-slate-750 hover:border-cyan-400 hover:text-cyan-400 text-slate-300 transition"
              title="Close (Esc)"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Left Portion: High Res image frame */}
            <div className="md:w-[60%] bg-slate-950 flex items-center justify-center relative p-3 md:p-6 border-b md:border-b-0 md:border-r border-slate-900 overflow-hidden">
              <img
                src={selectedPoster === 'poster1' ? scientificPoster1 : harmonyPoster2}
                alt="Selected Sonoluminescence Infographic High Definition"
                className="max-h-[45vh] md:max-h-[75vh] w-auto object-contain rounded-xl shadow-2xl"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Right Portion: Technical transcription */}
            <div className="md:w-[40%] p-6 md:p-8 flex flex-col justify-between overflow-y-auto max-h-[40vh] md:max-h-[90vh] text-left">
              <div className="space-y-6">
                <div>
                  <span className="font-mono text-[9px] text-[#22d3ee] tracking-widest font-extrabold uppercase bg-cyan-950/45 px-2.5 py-1 rounded-full border border-cyan-800/30">
                    {selectedPoster === 'poster1' ? 'EXH-POSTER ALPHA' : 'EXH-POSTER BETA'}
                  </span>
                  <h3 className="font-display text-2xl font-black text-white uppercase tracking-wide mt-3 leading-tight">
                    {selectedPoster === 'poster1' ? 'Sound Creating Light' : 'Harmony of Sound and Light'}
                  </h3>
                  <p className="font-mono text-xs text-purple-450 mt-1 uppercase tracking-wide">
                    {selectedPoster === 'poster1' ? 'THE CRITICAL CAVITATION CYCLE' : 'BIO-ACOUSTIC TRANSDUCTION FRAME'}
                  </p>
                </div>

                <div className="space-y-4 text-xs text-slate-350 leading-relaxed">
                  {selectedPoster === 'poster1' ? (
                    <>
                      <p className="font-sans text-slate-400">
                        This digital laboratory poster chronicles the extreme physical events generated during single-bubble cavitation initiated by the dactyl strike mechanics of the ocean&apos;s mantis shrimp.
                      </p>
                      <div className="p-3 bg-slate-950 border border-purple-950/30 rounded-xl space-y-1.5 font-mono text-[10px]">
                        <span className="text-cyan-400 font-bold block">1. ULTRAPRECISION STRIKE</span>
                        <p className="text-slate-400 text-[10px] font-sans">
                          Mantis shrimp snaps club at speeds exceeding 23 m/s in fluid conditions.
                        </p>
                        <span className="text-purple-400 font-bold block pt-1">2. ADIABATIC COLLAPSE</span>
                        <p className="text-slate-400 text-[10px] font-sans">
                          Restoring pressure forces bubble walls inward near the speed of sound.
                        </p>
                        <span className="text-emerald-400 font-black block pt-1">3. PHOTOEMISSION SPARK</span>
                        <p className="text-slate-400 text-[10px] font-sans">
                          Temperatures peak beyond 15,000K, ionizing noble gases to flash light.
                        </p>
                      </div>
                    </>
                  ) : (
                    <>
                      <p className="font-sans text-slate-400">
                        This artwork visualizes the energetic and spiritual bridge between human consciousness, marine mechanics, and solar rays. It represents sound waves travelling through darkness to forge a glowing path of awareness.
                      </p>
                      <div className="p-3 bg-slate-950 border border-cyan-950/30 rounded-xl space-y-1.5 font-mono text-[10px]">
                        <span className="text-cyan-400 font-bold block">⦿ INDIVIDUAL RESONANCE</span>
                        <p className="text-slate-400 text-[10px] font-sans">
                          &quot;I am a listener. I am a creator. I turn pressure into purpose. I create light from within.&quot;
                        </p>
                        <span className="text-purple-400 font-bold block pt-1">⦿ MARINE COMPRESSION</span>
                        <p className="text-slate-400 text-[10px] font-sans">
                          Cavitation acts as a focal lense for ambient energy fields.
                        </p>
                        <span className="text-emerald-400 font-black block pt-1">⦿ SOLAR DRIVER</span>
                        <p className="text-slate-400 text-[10px] font-sans">
                          The Sun fuels all oceans; the oceans teach us how to create light in depth.
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div className="pt-6 border-t border-slate-900 mt-6 flex flex-col gap-2 font-mono text-[9.5px]">
                <div className="flex justify-between text-slate-500">
                  <span>FILE SOURCE:</span>
                  <span className="text-slate-350">{selectedPoster === 'poster1' ? 'sono_scientific_poster_1.jpg' : 'sono_harmony_shrimp_person_2.jpg'}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>DECENTRALIZED ENCODING:</span>
                  <span className="text-emerald-450 font-bold">IPFS // ARWEAVE SECURE</span>
                </div>
                <button
                  onClick={() => setSelectedPoster(null)}
                  className="mt-4 w-full py-2.5 bg-slate-950 border border-cyan-500/25 text-white hover:bg-cyan-950 hover:text-cyan-400 hover:border-cyan-400 rounded-xl font-bold transition text-center"
                >
                  RETURN TO SYSTEM WORKSPACE
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
