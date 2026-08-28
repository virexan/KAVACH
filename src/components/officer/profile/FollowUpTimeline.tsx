import React from 'react';
import Card from '../../ui/Card';

interface TimelineItem {
  date: string;
  label: string;
  description?: string;
}

interface Props {
  timeline: TimelineItem[];
}

export const FollowUpTimeline: React.FC<Props> = ({ timeline }) => {
  if (!timeline || timeline.length === 0) {
    return (
      <Card className="p-5 select-none text-left bg-surface border border-border font-sans">
        <h4 className="text-xs font-semibold text-textMuted uppercase tracking-wider mb-2">Follow-Up History</h4>
        <p className="text-xs text-textMuted">No previous actions logged.</p>
      </Card>
    );
  }

  return (
    <Card className="p-5 select-none text-left bg-surface border border-border font-sans animate-fadeIn">
      <h3 className="font-bold text-textPrimary text-sm border-b border-border pb-2 mb-4 uppercase tracking-wide">
        Follow-Up & Intervention History
      </h3>

      <div className="relative border-l-2 border-border ml-3 pl-6 space-y-5 py-2">
        {timeline.map((item, idx) => (
          <div key={idx} className="relative">
            <span className="absolute -left-[31px] top-1 w-2.5 h-2.5 bg-primary border-2 border-surface rounded-full" />
            <div className="space-y-1">
              <span className="text-[10px] text-textMuted font-bold uppercase tracking-wider block">
                {new Date(item.date).toLocaleDateString('en-US', { day: '2-digit', month: 'short' })}
              </span>
              <h4 className="text-xs font-bold text-textPrimary leading-tight">
                {item.label}
              </h4>
              {item.description && (
                <p className="text-xs text-textSecondary leading-normal">
                  {item.description}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
export default FollowUpTimeline;
