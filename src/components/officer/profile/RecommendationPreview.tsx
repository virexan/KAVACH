import React from 'react';
import Card from '../../ui/Card';
import type { RecommendationSummary } from '@/services/caseService';

interface Props {
  recommendations?: RecommendationSummary[];
}

export const RecommendationPreview: React.FC<Props> = ({ recommendations }) => {
  const getPriorityStyle = (priority: string) => {
    switch (priority) {
      case 'HIGH': return 'bg-danger/10 text-danger border-danger/20';
      case 'MEDIUM': return 'bg-warning/10 text-warning border-warning/20';
      default: return 'bg-primary/10 text-primary border-primary/20';
    }
  };

  return (
    <Card className="p-5 select-none text-left bg-surface border border-border font-sans">
      <h3 className="font-bold text-textPrimary text-base border-b border-border pb-2 mb-4 uppercase tracking-wide">
        Recommended Support (AI Assist)
      </h3>

      {!recommendations || recommendations.length === 0 ? (
        <p className="text-xs text-textMuted leading-relaxed">No recommendations generated.</p>
      ) : (
        <div className="space-y-3">
          {recommendations.map((rec) => (
            <div key={rec.id} className="p-3 border border-border/80 rounded bg-surfaceAlt/20 space-y-2 animate-fadeIn">
              <div className="flex justify-between items-center">
                <h4 className="text-xs font-bold text-textPrimary">{rec.title}</h4>
                <span className={`text-[9px] font-black border uppercase px-1.5 py-0.5 rounded tracking-wide ${getPriorityStyle(rec.priority)}`}>
                  {rec.priority}
                </span>
              </div>
              <p className="text-xs text-textSecondary leading-relaxed">{rec.description}</p>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};
export default RecommendationPreview;
