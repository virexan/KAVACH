import React, { useState } from 'react';
import type { WellnessCheckIn } from '@/services/wellnessService';
import Card from '../ui/Card';

interface ChartProps {
  data: WellnessCheckIn[];
}

type MetricType = 'mood' | 'energy' | 'sleep' | 'stress' | 'fatigue';

export const TrendChart: React.FC<ChartProps> = ({ data }) => {
  const [metric, setMetric] = useState<MetricType>('mood');

  if (data.length < 2) {
    return (
      <div className="h-48 flex items-center justify-center border border-dashed border-border rounded-md text-xs text-textMuted select-none">
        More entries are needed to construct a trend pattern.
      </div>
    );
  }

  const getScoreValue = (log: WellnessCheckIn, m: MetricType) => {
    switch (m) {
      case 'mood': return log.moodScore;
      case 'energy': return log.energyScore;
      case 'sleep': return log.sleepScore;
      case 'stress': return log.stressScore;
      case 'fatigue': return log.fatigueScore;
    }
  };

  const getMetricLabel = (m: MetricType) => {
    return m.charAt(0).toUpperCase() + m.slice(1);
  };

  const getScoreLabel = (score: number, m: MetricType) => {
    if (m === 'mood') {
      return ['Very low', 'Low', 'Okay', 'Good', 'Very good'][score - 1];
    }
    if (m === 'sleep') {
      return ['Very poor', 'Poor', 'Okay', 'Good', 'Very good'][score - 1];
    }
    return ['Very low', 'Low', 'Moderate', 'High', 'Very high'][score - 1];
  };

  const width = 600;
  const height = 240;
  const paddingX = 40;
  const paddingY = 30;

  const chartWidth = width - paddingX * 2;
  const chartHeight = height - paddingY * 2;

  // Plotting points
  const points = data.map((log, index) => {
    const score = getScoreValue(log, metric);
    const x = paddingX + (index / (data.length - 1)) * chartWidth;
    // Map 1-5 to y range (higher score = lower SVG y coordinate)
    const y = paddingY + chartHeight - ((score - 1) / 4) * chartHeight;
    return { x, y, score, date: new Date(log.submittedAt) };
  });

  // SVG Line path
  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');

  // Y Axis ticks
  const yTicks = [5, 4, 3, 2, 1].map((score) => ({
    score,
    label: getScoreLabel(score, metric),
    y: paddingY + chartHeight - ((score - 1) / 4) * chartHeight,
  }));

  // X Axis ticks (e.g. show start, middle, end dates)
  const xTicksIndices = data.length <= 7 
    ? data.map((_, i) => i) 
    : [0, Math.floor(data.length / 2), data.length - 1];

  const xTicks = xTicksIndices.map((idx) => {
    const p = points[idx];
    return {
      x: p.x,
      label: p.date.toLocaleDateString('en-US', { day: '2-digit', month: 'short' }),
    };
  });

  return (
    <Card className="bg-surface select-none">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h3 className="font-bold text-textPrimary text-base">Wellbeing Trend</h3>
          <p className="text-xs text-textMuted mt-0.5">Showing levels over the requested period.</p>
        </div>

        {/* Metric Selector Buttons (FR-24) */}
        <div className="flex flex-wrap gap-1.5 bg-surfaceAlt/80 border border-border p-1 rounded-lg">
          {(['mood', 'energy', 'sleep', 'stress', 'fatigue'] as MetricType[]).map((m) => (
            <button
              key={m}
              onClick={() => setMetric(m)}
              className={`px-2.5 py-1 text-xs font-bold rounded-md transition-colors focus:outline-none ${
                metric === m
                  ? 'bg-primary text-white shadow-sm'
                  : 'text-textSecondary hover:bg-surfaceAlt'
              }`}
            >
              {getMetricLabel(m)}
            </button>
          ))}
        </div>
      </div>

      <div className="relative">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto">
          {/* Grid lines */}
          {yTicks.map((tick) => (
            <g key={tick.score} className="opacity-40">
              <line
                x1={paddingX}
                y1={tick.y}
                x2={width - paddingX}
                y2={tick.y}
                stroke="var(--border)"
                strokeWidth="1"
                strokeDasharray="4 4"
              />
              <text
                x={paddingX - 10}
                y={tick.y + 4}
                className="text-[10px] text-textMuted fill-current text-right font-semibold"
                textAnchor="end"
              >
                {tick.label}
              </text>
            </g>
          ))}

          {/* Line Plot */}
          <path
            d={linePath}
            fill="none"
            stroke="var(--primary)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Data Points */}
          {points.map((p, idx) => (
            <g key={idx} className="group">
              <circle
                cx={p.x}
                cy={p.y}
                r="4.5"
                className="fill-surface stroke-primary stroke-[2.5px] cursor-pointer hover:r-6 hover:fill-primary hover:stroke-surface transition-all"
              />
              <title>
                {p.date.toLocaleDateString('en-US', { day: '2-digit', month: 'short' })}: {getScoreLabel(p.score, metric)}
              </title>
            </g>
          ))}

          {/* X Axis labels */}
          {xTicks.map((tick, idx) => (
            <text
              key={idx}
              x={tick.x}
              y={height - paddingY + 18}
              className="text-[10px] text-textMuted fill-current font-bold"
              textAnchor="middle"
            >
              {tick.label}
            </text>
          ))}
        </svg>
      </div>

      <div className="mt-4 pt-3 border-t border-border/40 text-center text-xs text-textMuted">
        Hover over dots to view specific daily self-report readings.
      </div>
    </Card>
  );
};
export default TrendChart;
