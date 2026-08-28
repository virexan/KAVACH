import React from 'react';
import Card from '../ui/Card';
import type { ServiceHealth } from '@/services/adminService';

interface Props {
  services: ServiceHealth[];
  onSelectService?: (service: ServiceHealth) => void;
}

export const SystemHealthOverview: React.FC<Props> = ({ services, onSelectService }) => {
  const getStatusStyle = (st: string) => {
    switch (st) {
      case 'OPERATIONAL':
        return 'text-success bg-success/10 border-success/20';
      case 'DEGRADED':
        return 'text-warning bg-warning/10 border-warning/20';
      case 'UNAVAILABLE':
        return 'text-danger bg-danger/10 border-danger/20';
      default:
        return 'text-textSecondary bg-surfaceAlt border-border';
    }
  };

  return (
    <Card className="bg-surface border border-border p-5 font-sans select-none text-left space-y-4 animate-fadeIn">
      <div>
        <h3 className="font-bold text-textPrimary text-base">System Health & Services</h3>
        <p className="text-[10px] text-textMuted uppercase font-bold tracking-wide">Infrastructure and model endpoint statuses (FR-9, FR-42)</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {services.map((srv) => (
          <div
            key={srv.id}
            onClick={() => onSelectService?.(srv)}
            className={`p-4 border border-border rounded-lg bg-surfaceAlt/20 space-y-2 select-none text-left transition-transform duration-200 hover:scale-[1.01] ${
              onSelectService ? 'cursor-pointer hover:bg-surfaceAlt/40' : ''
            }`}
          >
            <div className="flex justify-between items-start gap-2">
              <span className="font-bold text-textPrimary text-xs leading-snug">{srv.name}</span>
              <span className={`px-2 py-0.5 border rounded text-[8px] font-bold uppercase tracking-wider ${getStatusStyle(srv.status)}`}>
                {srv.status}
              </span>
            </div>
            <div className="flex justify-between items-center text-[10px] text-textSecondary pt-1 border-t border-border/20">
              <span>Latency: <strong className="text-textPrimary">{srv.responseTimeMs || '—'} ms</strong></span>
              <span>Version: <strong className="text-textPrimary">{srv.version || '—'}</strong></span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
export default SystemHealthOverview;
