import React from 'react';
import Card from '../ui/Card';
import type { AggregateRiskPoint } from '@/services/commanderService';

interface Props {
  points: AggregateRiskPoint[];
  direction: string;
}

export const AggregateRiskTrendChart: React.FC<Props> = ({ points, direction }) => {
  if (points.length === 0) {
    return (
      <Card className="p-8 text-center bg-surface border border-border">
        <p className="text-xs text-textMuted font-bold">No trend data coordinates logged for this range.</p>
      </Card>
    );
  }

  // Find max value to calibrate height
  const maxVal = Math.max(...points.map((p) => (p.low + p.moderate + p.elevated + p.high + (p.insufficientData || 0))));
  const width = 500;
  const height = 150;
  const padding = 20;

  const getCoordinates = (index: number, value: number) => {
    if (points.length <= 1) return { x: padding, y: height / 2 };
    const x = padding + (index / (points.length - 1)) * (width - 2 * padding);
    const y = height - padding - (value / maxVal) * (height - 2 * padding);
    return { x, y };
  };

  const lowModCoords = points.map((p, idx) => getCoordinates(idx, p.low + p.moderate));
  const elHighCoords = points.map((p, idx) => getCoordinates(idx, p.elevated + p.high));

  const lowModPath = lowModCoords.map((c, i) => `${i === 0 ? 'M' : 'L'} ${c.x} ${c.y}`).join(' ');
  const elHighPath = elHighCoords.map((c, i) => `${i === 0 ? 'M' : 'L'} ${c.x} ${c.y}`).join(' ');

  return (
    <Card className="bg-surface border border-border p-5 font-sans select-none text-left space-y-4 animate-fadeIn">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-bold text-textPrimary text-base">30-Day Welfare Trend</h3>
          <p className="text-[10px] text-textMuted uppercase font-bold tracking-wide">Proportion shifts over reporting periods (FR-13)</p>
        </div>
        <span className="text-xs font-bold text-danger bg-danger/10 border border-danger/20 px-2 py-0.5 rounded uppercase select-none">
          Trend: {direction}
        </span>
      </div>

      <div className="relative">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto select-none" overflow="visible">
          {/* Grid lines */}
          <line x1={padding} y1={padding} x2={width - padding} y2={padding} stroke="currentColor" className="text-border/40" strokeDasharray="3 3" />
          <line x1={padding} y1={height / 2} x2={width - padding} y2={height / 2} stroke="currentColor" className="text-border/40" strokeDasharray="3 3" />
          <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="currentColor" className="text-border" />

          {/* Paths */}
          <path d={lowModPath} fill="none" stroke="var(--color-success, #10b981)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          <path d={elHighPath} fill="none" stroke="var(--color-danger, #ef4444)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />

          {/* Points */}
          {lowModCoords.map((c, i) => (
            <circle key={`lm-${i}`} cx={c.x} cy={c.y} r="4" fill="var(--color-success, #10b981)" stroke="white" strokeWidth="1" />
          ))}
          {elHighCoords.map((c, i) => (
            <circle key={`eh-${i}`} cx={c.x} cy={c.y} r="4" fill="var(--color-danger, #ef4444)" stroke="white" strokeWidth="1" />
          ))}
        </svg>
      </div>

      <div className="flex justify-between text-[10px] text-textMuted font-bold uppercase tracking-wider px-2">
        <span>{points[0].date}</span>
        <span>{points[points.length - 1].date}</span>
      </div>

      <div className="flex flex-wrap gap-4 text-xs pt-2 border-t border-border/40 font-medium text-textSecondary">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-0.5 bg-success block" />
          <span>Low/Moderate Risk Co-counts</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-0.5 bg-danger block" />
          <span>Elevated/High Risk Co-counts</span>
        </div>
      </div>
    </Card>
  );
};
export default AggregateRiskTrendChart;
