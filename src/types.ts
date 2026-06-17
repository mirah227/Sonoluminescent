/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface SimulationParams {
  speed: number;       // Base orbital speed multiplier [0.1 - 3.0]
  excitation: number;  // Multiplicity count of waves/particles [2 - 16]
  resonance: number;   // Amplitude/Wave scale [0 - 100]
  dissipation: number; // Tail duration or entropy [10 - 95] (represents fade rate)
  graviton: number;    // Cursor magnetism pull intensity [0 - 100]
}

export type NodeId = 'sol-alpha' | 'nadir-beta' | 'lumina-gamma';

export interface TelemetryNode {
  id: NodeId;
  name: string;
  codename: string;
  color: string;       // Primary glowing hex color
  accentColor: string; // Secondary glowing tail hex key
  status: 'OPTIMAL' | 'SYNCED' | 'DRIFTING' | 'MUTUAL';
  frequency: number;   // In Hz, related to sound pitch
  description: string;
  metricLabel: string;
  metricUnit: string;
}

export interface TerminalLog {
  id: string;
  timestamp: string;
  level: 'INF' | 'WRN' | 'SYS';
  message: string;
}
