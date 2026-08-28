import React from 'react';
import Card from '../../ui/Card';

interface Props {
  history: { date: string; level: string }[];
}

export const RiskHistoryChart: React.FC<Props> = ({ history }) => {
  const levels = ['LOW', 'MODERATE', 'ELEVATED', 'HIGH'];

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'LOW': return 'bg-primary';
      case 'MODERATE': return 'bg-warning';
      case 'ELEVATED': return 'bg-orange-500';
      case 'HIGH': return 'bg-danger';
      default: return 'bg-textMuted';
    }
  };

  if (!history || history.length === 0) {
    return (
      <Card className="p-5 select-none text-left bg-surface border border-border font-sans">
        <h4 className="text-xs font-semibold text-textMuted uppercase tracking-wider mb-2">30-Day Risk History</h4>
        <p className="text-xs text-textMuted">No historical data logs available.</p>
      </Card>
    );
  }

  return (
    <Card className="p-5 select-none text-left bg-surface border border-border font-sans">
      <h4 className="text-xs font-semibold text-textMuted uppercase tracking-wider mb-4">
        30-Day Risk History (Stepped Chart)
      </h4>

      <div className="flex flex-col gap-3 font-sans">
        {levels.slice().reverse().map((lvl) => (
          <div key={lvl} className="flex items-center gap-4">
            <span className="w-16 text-[10px] font-bold text-textSecondary uppercase select-none tracking-wider text-right">
              {lvl}
            </span>
            <div className="flex-1 flex gap-2">
              {history.map((h, idx) => {
                const isActive = h.level === lvl;
                return (
                  <div
                    key={idx}
                    className={`flex-1 h-6 rounded border transition-all flex flex-col justify-center items-center ${
                      isActive
                        ? `${getLevelColor(lvl)} border-transparent text-white font-bold text-[9px] shadow-sm`
                        : 'bg-surfaceAlt/30 border-border/40 text-textMuted/40 text-[9px]'
                    }`}
                    title={`${h.date}: ${h.level}`}
                  >
                    <span>{isActive ? h.date : ''}</span>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      <p className="text-[10px] text-textMuted font-semibold mt-4 text-center">
        Columns represent assessments over time. Highlighted blocks show active risk states (FR-13).
      </p>
    </Card>
  );
};
export default RiskHistoryChart;
