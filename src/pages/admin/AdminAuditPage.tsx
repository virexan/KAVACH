import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import adminService from '@/services/adminService';
import type { AuditEvent } from '@/services/adminService';
import AuditLogTable from '@/components/admin/AuditLogTable';
import Select from '@/components/ui/Select';
import Skeleton from '@/components/ui/Skeleton';
import EmptyState from '@/components/ui/EmptyState';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';

export const AdminAuditPage: React.FC = () => {
  const [category, setCategory] = useState('ALL');
  const [selectedEvent, setSelectedEvent] = useState<AuditEvent | null>(null);

  const { data: auditRes, isLoading, isError } = useQuery({
    queryKey: ['admin-audit-logs', category],
    queryFn: () => adminService.getAuditLogs({ category }),
  });

  const categoryOptions = [
    { label: 'All Categories', value: 'ALL' },
    { label: 'Authentication', value: 'AUTH' },
    { label: 'User Management', value: 'USER' },
    { label: 'Role Changes', value: 'ROLE' },
    { label: 'Welfare Cases', value: 'CASE' },
    { label: 'Consent policy', value: 'CONSENT' },
    { label: 'Recommendations', value: 'RECOMMENDATION' },
    { label: 'Interventions', value: 'INTERVENTION' },
    { label: 'Risk Models', value: 'MODEL' },
    { label: 'System Configuration', value: 'SYSTEM' }
  ];

  const list = auditRes?.data || [];

  return (
    <div className="space-y-6 select-none font-sans text-left animate-fadeIn">
      <div>
        <h1 className="text-xl font-black text-textPrimary leading-tight">Platform Audit Trail</h1>
        <p className="text-xs text-textMuted mt-0.5">Immutable records of administrative and security events (FR-31).</p>
      </div>

      {/* Filter toolbar */}
      <div className="max-w-xs select-none">
        <Select
          label="Filter Activity Category"
          options={categoryOptions}
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />
      </div>

      {isLoading ? (
        <Skeleton variant="block" className="h-48 w-full" />
      ) : isError ? (
        <div className="bg-danger/10 border border-danger/20 text-danger text-xs font-semibold p-4 rounded-md text-center">
          Failed to load audit logs. Please retry. (FR-69)
        </div>
      ) : list.length === 0 ? (
        <EmptyState
          title="No audit logs"
          description="No activity matches your filters."
          className="bg-surface border border-border font-sans"
        />
      ) : (
        <div className="animate-fadeIn">
          <AuditLogTable
            logs={list}
            onSelect={setSelectedEvent}
          />
        </div>
      )}

      {/* Audit Detail Modal (FR-34) */}
      <Modal
        isOpen={!!selectedEvent}
        onClose={() => setSelectedEvent(null)}
        title="Audit Event Detail"
        className="max-w-md w-full"
      >
        {selectedEvent && (
          <div className="space-y-4 font-sans text-left">
            <div className="space-y-2.5 text-xs leading-relaxed">
              <div className="grid grid-cols-3">
                <span className="font-semibold text-textSecondary">Timestamp:</span>
                <span className="col-span-2 text-textPrimary font-semibold">
                  {new Date(selectedEvent.timestamp).toLocaleString()}
                </span>
              </div>
              <div className="grid grid-cols-3">
                <span className="font-semibold text-textSecondary">Actor Name:</span>
                <span className="col-span-2 text-textPrimary font-bold">
                  {selectedEvent.actorDisplayName} <span className="text-[10px] text-textMuted font-medium">({selectedEvent.actorId})</span>
                </span>
              </div>
              <div className="grid grid-cols-3">
                <span className="font-semibold text-textSecondary">Action Type:</span>
                <span className="col-span-2 text-textPrimary font-bold uppercase">
                  {selectedEvent.action}
                </span>
              </div>
              <div className="grid grid-cols-3">
                <span className="font-semibold text-textSecondary">Resource ID:</span>
                <span className="col-span-2 text-textPrimary font-semibold">
                  {selectedEvent.resourceId || '—'}
                </span>
              </div>
              <div className="grid grid-cols-3">
                <span className="font-semibold text-textSecondary">Result State:</span>
                <span className="col-span-2 text-success font-bold uppercase font-sans">
                  {selectedEvent.result}
                </span>
              </div>
              <div className="pt-2.5 border-t border-border/40 space-y-1">
                <span className="font-semibold text-textSecondary">Action Description:</span>
                <p className="p-2.5 bg-surfaceAlt/60 border border-border rounded text-textSecondary font-medium">
                  {selectedEvent.summary}
                </p>
              </div>
            </div>
            <div className="flex gap-2 justify-end pt-2 border-t border-border mt-4 font-sans">
              <Button variant="secondary" size="sm" onClick={() => setSelectedEvent(null)}>
                Close
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
export default AdminAuditPage;
