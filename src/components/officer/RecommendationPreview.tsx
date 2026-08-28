import React from 'react';
import Card from '../ui/Card';

interface Props {
  recommendations: string[];
}

export const RecommendationPreview: React.FC<Props> = ({ recommendations }) => {
  return (
    <Card className="bg-surface p-5 select-none space-y-3 font-sans">
      <h3 className="font-bold text-textPrimary text-sm border-b border-border pb-2 uppercase tracking-wide">
        Recommended Support Actions (AI Assist)
      </h3>

      {recommendations.length === 0 ? (
        <p className="text-xs text-textMuted leading-relaxed">No recommendations generated.</p>
      ) : (
        <ol className="list-decimal pl-4 text-xs text-textSecondary space-y-2">
          {recommendations.map((rec, idx) => (
            <li key={idx} className="leading-relaxed font-medium">
              {rec}
            </li>
          ))}
        </ol>
      )}
    </Card>
  );
};
export default RecommendationPreview;
