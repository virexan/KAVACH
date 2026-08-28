import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import caseService from '@/services/caseService';
import Card from '../../ui/Card';
import Skeleton from '../../ui/Skeleton';

interface Props {
  caseId: string;
}

export const WorkloadTrendChart: React.FC<Props> = ({ caseId }) => {
  const [metric, setMetric] = useState('workload');
  const [period, setPeriod] = useState('30d');

  const { data: trendRes, isLoading, isError } = useQuery({
    queryKey: ['workload-trends-officer', caseId, metric, period],
    queryFn: () => caseService.getCaseTrends(caseId, metric, period),
  });

  const metrics = [
    { value: 'workload', label: 'Workload Index' },
    { value: 'fatigue', label: 'Fatigue rating' }
  ];

  const periods = [
    { value: '7d', label: '7 Days' },
    { value: '30d', label: '30 Days' },
    { value: '90d', label: '90 Days' },
  ];

  const trendData = trendRes?.data;
  const points = trendData?.points || [];

  const renderSvgChart = () => {
    if (points.length === 0) return null;

    const width = 500;
    const height = 150;
    const padding = 20;

    const values = points.map((p) => p.value);
    const minVal = Math.min(...values);
    const maxVal = Math.max(...values);
    const valRange = maxVal - minVal || 1;

    const getX = (idx: number) => padding + (idx / (points.length - 1)) * (width - 2 * padding);
    const getY = (val: number) => height - padding - ((val - minVal) / valRange) * (height - 2 * padding);

    let pathD = `M ${getX(0)} ${getY(points[0].value)}`;
    for (let i = 1; i < points.length; i++) {
      pathD += ` L ${getX(i)} ${getY(points[i].value)}`;
    }

    return (
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-40">
        <line x1={padding} y1={padding} x2={width - padding} y2={padding} stroke="rgba(229,231,235,0.4)" strokeWidth={1} />
        <line x1={padding} y1={height / 2} x2={width - padding} y2={height / 2} stroke="rgba(229,231,235,0.4)" strokeWidth={1} />
        <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="rgba(229,231,235,0.4)" strokeWidth={1} />

        <path d={pathD} fill="none" stroke="#D32F2F" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />

        {points.map((p, idx) => (
          <g key={idx} className="group cursor-pointer">
            <circle cx={getX(idx)} cy={getY(p.value)} r={3} fill="#D32F2F" />
            <circle cx={getX(idx)} cy={getY(p.value)} r={7} fill="#D32F2F" fillOpacity={0} className="hover:fill-opacity-20 transition-all" />
            <title>{`${p.date}: ${p.value}`}</title>
          </g>
        ))}
      </svg>
    );
  };

  return (
    <Card className="p-5 select-none text-left bg-surface border border-border font-sans">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-border pb-3 mb-4">
        <div>
          <h3 className="font-bold text-textPrimary text-base">Workload Trend History</h3>
          <p className="text-xs text-textMuted mt-0.5">Roster workloads and fatiguing active periods.</p>
        </div>

        <div className="flex gap-1.5 bg-surfaceAlt/60 p-1 rounded border border-border/80 animate-fadeIn">
          {periods.map((p) => (
            <button
              key={p.value}
              onClick={() => setPeriod(p.value)}
              className={`px-2.5 py-1 rounded text-[10px] font-bold transition-all focus:outline-none ${
                period === p.value
                  ? 'bg-surface text-textPrimary shadow-sm'
                  : 'text-textSecondary hover:text-textPrimary'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5 mb-4 animate-fadeIn">
        {metrics.map((m) => (
          <button
            key={m.value}
            onClick={() => setMetric(m.value)}
            className={`px-3 py-1.5 rounded-full border text-[10px] font-bold tracking-wide uppercase transition-all focus:outline-none ${
              metric === m.value
                ? 'bg-danger/10 text-danger border-danger/20 shadow-sm'
                : 'bg-surface border-border text-textSecondary hover:bg-surfaceAlt/40'
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <Skeleton variant="block" className="h-40 w-full" />
      ) : isError ? (
        <div className="bg-danger/10 border border-danger/20 text-danger text-xs font-semibold p-4 rounded-md text-center">
          Workload trend details are temporarily unavailable.
        </div>
      ) : points.length === 0 ? (
        <div className="text-center py-10 text-xs text-textMuted border border-dashed border-border rounded">
          Insufficient data points to render workload trend history.
        </div>
      ) : (
        <div className="space-y-4 animate-fadeIn">
          <div className="border border-border/60 rounded p-2 bg-surfaceAlt/10">
            {renderSvgChart()}
          </div>
          {trendData?.summary && (
            <p className="text-xs font-semibold text-textSecondary bg-surfaceAlt/40 p-2.5 border border-border/60 rounded-md">
              📝 Note: {trendData.summary}
            </p>
          )}
        </div>
      )}
    </Card>
  );
};
export default WorkloadTrendChart;
