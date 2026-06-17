/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { TerminalLog } from '../types';
import { Terminal as TerminalIcon, Trash2, Download, Send, Check } from 'lucide-react';

interface TechnicalTerminalProps {
  logs: TerminalLog[];
  setLogs: React.Dispatch<React.SetStateAction<TerminalLog[]>>;
  onExecuteCommand: (command: string) => void;
}

export const TechnicalTerminal: React.FC<TechnicalTerminalProps> = ({
  logs,
  setLogs,
  onExecuteCommand,
}) => {
  const [inputValue, setInputValue] = useState('');
  const [downloaded, setDownloaded] = useState(false);
  const terminalEndRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll logs to bottom
  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    
    // Pass up to father to process
    onExecuteCommand(inputValue.trim());
    setInputValue('');
  };

  const handleClear = () => {
    setLogs([
      {
        id: 'system-clear-' + Date.now().toString(),
        timestamp: new Date().toLocaleTimeString(),
        level: 'SYS',
        message: 'Telemetry terminal buffer cleared. Listening on SONO port 3000.',
      }
    ]);
  };

  const handleDownloadLogs = () => {
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 2000);

    const logText = logs
      .map((l) => `[${l.timestamp}] [${l.level}] ${l.message}`)
      .join('\n');
    
    const blob = new Blob([`ANALEMMA TELEMETRY CLOUD EXPORT\n==============================\nDate: ${new Date().toISOString()}\n\n${logText}`], {
      type: 'text/plain',
    });
    
    const url = URL.createObjectURL(blob);
    const element = document.createElement('a');
    element.href = url;
    element.download = `analemma_node_logs_${Date.now()}.txt`;
    document.body.appendChild(element);
    element.click();
    
    // Clean up
    document.body.removeChild(element);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-[#0b0c15]/90 border border-slate-800/80 rounded-2xl p-4 flex flex-col h-[320px] shadow-2xl relative">
      {/* Header controls bar */}
      <div className="flex justify-between items-center border-b border-slate-850 pb-3 mb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded bg-cyan-950/40 border border-cyan-850/50">
            <TerminalIcon className="w-4 h-4 text-cyan-400" />
          </div>
          <div>
            <h3 className="text-sm font-display font-medium text-slate-200">
              Technical Telemetry Terminal
            </h3>
            <span className="font-mono text-[9px] text-slate-450 block">
              CONSOLE HOST: Port 3000 // ANALEMMA_CORE_RESONANCE
            </span>
          </div>
        </div>

        {/* Action icons */}
        <div className="flex gap-1.5">
          <button
            id="clear-logs-btn"
            onClick={handleClear}
            className="p-1.5 rounded text-slate-400 hover:text-rose-400 hover:bg-slate-900 border border-transparent hover:border-slate-800 transition"
            title="Clear Console Buffer"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
          
          <button
            id="download-logs-btn"
            onClick={handleDownloadLogs}
            className="p-1.5 rounded text-slate-400 hover:text-cyan-400 hover:bg-slate-900 border border-transparent hover:border-slate-800 transition flex items-center gap-1 font-mono text-[10px]"
            title="Export Report Document"
          >
            {downloaded ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Exported</span>
              </>
            ) : (
              <>
                <Download className="w-3.5 h-3.5" />
                <span>Export Reports</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main logs screen section */}
      <div 
        role="log"
        aria-live="polite"
        className="flex-1 overflow-y-auto mb-3 pr-1 space-y-1.5 font-mono text-xs select-text scrollbar-thin scrollbar-thumb-slate-850"
      >
        {logs.map((log) => {
          let levelColor = 'text-cyan-400';
          if (log.level === 'WRN') levelColor = 'text-amber-500';
          if (log.level === 'SYS') levelColor = 'text-emerald-400';

          return (
            <div key={log.id} className="flex items-start gap-2 hover:bg-slate-900/40 p-0.5 rounded transition">
              <span className="text-slate-550 shrink-0">[{log.timestamp}]</span>
              <span className={`shrink-0 font-bold ${levelColor}`}>[{log.level}]</span>
              <span className="text-slate-200 leading-relaxed break-all">{log.message}</span>
            </div>
          );
        })}
        <div ref={terminalEndRef} />
      </div>

      {/* Interactive Command submit form */}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <label htmlFor="terminal-command-input" className="sr-only">Enter terminal command</label>
        <span className="font-mono text-cyan-400 font-bold self-center mr-0.5" aria-hidden="true">&gt;</span>
        <input
          id="terminal-command-input"
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Enter command (e.g. /clear, /sync 500, /boost, /help)..."
          className="flex-1 bg-slate-950 border border-slate-800/80 rounded-lg px-3 py-1.5 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500/80 focus:ring-1 focus:ring-cyan-500/20 font-mono text-xs transition"
          autoComplete="off"
        />
        <button
          type="submit"
          className="px-3 py-1.5 bg-slate-900 hover:bg-cyan-950/60 border border-slate-800 hover:border-cyan-800 text-slate-300 hover:text-cyan-400 rounded-lg font-mono text-xs transition flex items-center gap-1"
          aria-label="Send command"
        >
          <Send className="w-3 h-3" />
          <span>Execute</span>
        </button>
      </form>
    </div>
  );
};
