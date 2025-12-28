
export interface TemplateSymbol {
  type: 'lamp' | 'resistor' | 'source' | 'meter_a' | 'meter_v' | 'switch';
  x: number;
  y: number;
  id: string; // Internal ID for connection reference
}

export interface TemplateConnection {
  source: string;
  sourceHandle: 'top' | 'bottom' | 'left' | 'right';
  target: string;
  targetHandle: 'top' | 'bottom' | 'left' | 'right';
}

export interface CircuitTemplate {
  id: string;
  name: string;
  description: string;
  symbols: TemplateSymbol[];
  connections: TemplateConnection[];
}

export const TEMPLATES: Record<string, CircuitTemplate> = {
  series: {
    id: 'series',
    name: '直列回路',
    description: '電源、スイッチ、電流計、抵抗などが直列につながれた回路です。',
    symbols: [
      { type: 'source', x: 526, y: 220, id: 'src' },
      { type: 'switch', x: 706, y: 220, id: 'sw' },
      { type: 'meter_a', x: 809, y: 322, id: 'meter_a-1' },
      { type: 'resistor', x: 666, y: 440, id: 'resistor-1' },
      { type: 'resistor', x: 486, y: 440, id: 'resistor-2' },
    ],
    connections: [
      { source: 'src', sourceHandle: 'right', target: 'sw', targetHandle: 'left' },
      { source: 'sw', sourceHandle: 'right', target: 'meter_a-1', targetHandle: 'top' },
      { source: 'meter_a-1', sourceHandle: 'bottom', target: 'resistor-1', targetHandle: 'right' },
      { source: 'resistor-1', sourceHandle: 'left', target: 'resistor-2', targetHandle: 'right' },
      { source: 'resistor-2', sourceHandle: 'left', target: 'src', targetHandle: 'left' },
    ]
  },
  parallel: {
    id: 'parallel',
    name: '並列回路',
    description: '抵抗が並列につながれ、電流計で全体の電流を計測する回路です。',
    symbols: [
      { type: 'source', x: 380, y: 100, id: 'src' },
      { type: 'switch', x: 580, y: 100, id: 'sw' },
      { type: 'meter_a', x: 640, y: 180, id: 'meter_a-1' },
      { type: 'resistor', x: 480, y: 280, id: 'registor-1' },
      { type: 'resistor', x: 480, y: 380, id: 'resistor-2' },
    ],
    connections: [
      { source: 'src', sourceHandle: 'right', target: 'sw', targetHandle: 'left' },
      { source: 'sw', sourceHandle: 'right', target: 'meter_a-1', targetHandle: 'top' },
      // Branch from Meter A
      { source: 'meter_a-1', sourceHandle: 'bottom', target: 'registor-1', targetHandle: 'right' },
      { source: 'meter_a-1', sourceHandle: 'bottom', target: 'resistor-2', targetHandle: 'right' },
      // Return to Source
      { source: 'registor-1', sourceHandle: 'left', target: 'src', targetHandle: 'left' },
      { source: 'resistor-2', sourceHandle: 'left', target: 'src', targetHandle: 'left' },
    ]
  }
}