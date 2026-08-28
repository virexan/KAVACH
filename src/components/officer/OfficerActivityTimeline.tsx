import React from 'react';
import Card from '../ui/Card';

export interface TimelineItem {
  date: string;
  label: string;
  description?: string;
}

interface Props {
  items: TimelineItem[];
}

export const OfficerActivityTimeline: React.FC<Props> = ({ items }) => {
  if (!items || items.length === 0) {
    return <span className="text-textMuted text-xs font-semibold select-none">No activity logged.</span>;
  }

  return (
    <Card className="bg-surface p-5 select-none space-y-4 font-sans">
      <h3 className="font-bold text-textPrimary text-sm border-b border-border pb-2 uppercase tracking-wide">
        Case Activity Timeline
      </h3>

      <div className="relative border-l-2 border-border ml-3 pl-6 space-y-5 py-2">
        {items.map((item, idx) => (
          <div key={idx} className="relative animate-fadeIn">
            {/* Dot marker */}
            <span className="absolute -left-[31px] top-1 w-2.5 h-2.5 bg-primary border-2 border-surface rounded-full" />
            <div className="space-y-1">
              <span className="text-[10px] text-textMuted font-bold uppercase tracking-wider">
                {new Date(item.date).toLocaleDateString('en-US', { day: '2-digit', month: 'short' })}
              </span>
              <h4 className="text-xs font-semibold text-textPrimary leading-tight">
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
export default OfficerActivityTimeline;
