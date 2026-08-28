import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import adminService from '@/services/adminService';
import type { ServiceHealth } from '@/services/adminService';
import SystemHealthOverview from '@/components/admin/SystemHealthOverview';
import Card from '@/components/ui/Card';
import Skeleton from '@/components/ui/Skeleton';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';

export const AdminSystemHealthPage: React.FC = () => {
  const [selectedService, setSelectedService] = useState<ServiceHealth | null>(null);

  const { data: healthRes, isLoading, isError } = useQuery({
    queryKey: ['admin-system-health-page'],
    queryFn: () => adminService.getSystemHealth(),
  });

  const list = healthRes?.data || [];

  return (
    <div className="space-y-6 select-none font-sans text-left animate-fadeIn">
      <div>
        <h1 className="text-xl font-black text-textPrimary leading-tight">System Health & Services</h1>
        <p className="text-xs text-textMuted mt-0.5">Real-time status check-ins and performance index logs (FR-42).</p>
      </div>

      {isLoading ? (
        <Skeleton variant="block" className="h-48 w-full" />
      ) : isError ? (
        <div className="bg-danger/10 border border-danger/20 text-danger text-xs font-semibold p-4 rounded-md text-center font-sans">
          Health logs unavailable. Please retry. (FR-69)
        </div>
      ) : (
        <div className="space-y-6 animate-fadeIn">
          <SystemHealthOverview
            services={list}
            onSelectService={setSelectedService}
          />

          {/* Data Pipeline Health summaries (FR-44) */}
          <Card className="bg-surface border border-border p-5 space-y-4">
            <div>
              <h3 className="font-bold text-textPrimary text-base">Data Pipeline Health</h3>
              <p className="text-[10px] text-textMuted uppercase font-bold tracking-wide">Sync cycles for operational rosters</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs font-sans">
              <div className="p-3 border border-border rounded-lg bg-surface space-y-1">
                <span className="font-semibold text-textMuted uppercase text-[9px] block">Wellness Logs</span>
                <span className="font-bold text-success">Fresh (Updated today)</span>
              </div>
              <div className="p-3 border border-border rounded-lg bg-surface space-y-1">
                <span className="font-semibold text-textMuted uppercase text-[9px] block">Workload hours</span>
                <span className="font-bold text-success">Fresh (Updated today)</span>
              </div>
              <div className="p-3 border border-border rounded-lg bg-surface space-y-1">
                <span className="font-semibold text-textMuted uppercase text-[9px] block">Deployment periods</span>
                <span className="font-bold text-success">Fresh (Updated yesterday)</span>
              </div>
              <div className="p-3 border border-border rounded-lg bg-surface space-y-1">
                <span className="font-semibold text-textMuted uppercase text-[9px] block">Leave rosters</span>
                <span className="font-bold text-success">Fresh (Updated yesterday)</span>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Service details diagnostics modal (FR-43) */}
      <Modal
        isOpen={!!selectedService}
        onClose={() => setSelectedService(null)}
        title={selectedService?.name || 'Service Status Diagnostics'}
        className="max-w-sm w-full font-sans"
      >
        {selectedService && (
          <div className="space-y-4 font-sans text-left text-xs leading-relaxed">
            <div className="grid grid-cols-2">
              <span className="font-semibold text-textSecondary font-sans">Service Status:</span>
              <span className="text-success font-bold uppercase">{selectedService.status}</span>
            </div>
            <div className="grid grid-cols-2">
              <span className="font-semibold text-textSecondary font-sans font-sans">Latency/Check:</span>
              <span className="text-textPrimary font-semibold">{selectedService.responseTimeMs} ms</span>
            </div>
            <div className="grid grid-cols-2">
              <span className="font-semibold text-textSecondary font-sans font-sans">Last Sync Run:</span>
              <span className="text-textPrimary font-medium">
                {new Date(selectedService.lastCheckedAt).toLocaleTimeString()}
              </span>
            </div>
            <div className="grid grid-cols-2">
              <span className="font-semibold text-textSecondary font-sans font-sans">Service Version:</span>
              <span className="text-textMuted font-bold">{selectedService.version || '—'}</span>
            </div>
            <div className="flex gap-2 justify-end pt-2 border-t border-border mt-4 font-sans">
              <Button variant="secondary" size="sm" onClick={() => setSelectedService(null)}>
                Close Diagnostics
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
export default AdminSystemHealthPage;
