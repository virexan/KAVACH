import React from 'react';
import CommanderAlertCard from './CommanderAlertCard';
import type { CommanderAlert } from '@/services/commanderService';

interface Props {
  alerts: CommanderAlert[];
}

export const CommanderAlertList: React.FC<Props> = ({ alerts }) => {
  if (alerts.length === 0) {
    return (
      <div className="p-5 border border-dashed border-border rounded-lg bg-surface/50 text-center font-sans select-none text-xs text-textMuted py-8">
        No active organizational trend alerts. (FR-56)
      </div>
    );
  }

  return (
    <div className="space-y-3 font-sans">
      {alerts.map((a) => (
        <CommanderAlertCard key={a.id} alert={a} />
      ))}
    </div>
  );
};
export default CommanderAlertList;
