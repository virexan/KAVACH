import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import adminService from '@/services/adminService';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Skeleton from '@/components/ui/Skeleton';
import Modal from '@/components/ui/Modal';

export const AdminSettingsPage: React.FC = () => {
  const { isLoading, refetch } = useQuery({
    queryKey: ['admin-settings-page'],
    queryFn: () => adminService.getSettings(),
  });

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);

  // Form states (FR-45)
  const [timeout, setTimeoutVal] = useState(30);
  const [attempts, setAttempts] = useState(5);
  const [retention, setRetention] = useState(365);

  const handleOpenConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    setShowConfirmModal(true);
  };

  const handleSave = async () => {
    setIsSubmitLoading(true);
    try {
      await adminService.updateSettings({
        sessionTimeoutMinutes: timeout,
        loginProtectionAttempts: attempts,
        auditRetentionDays: retention
      });
      setShowConfirmModal(false);
      refetch();
    } finally {
      setIsSubmitLoading(false);
    }
  };

  return (
    <div className="space-y-6 select-none font-sans text-left animate-fadeIn">
      <div>
        <h1 className="text-xl font-black text-textPrimary leading-tight">System Configuration</h1>
        <p className="text-xs text-textMuted mt-0.5">Configure platform timeouts, retry bounds, and log retention terms (FR-45).</p>
      </div>

      {isLoading ? (
        <Skeleton variant="block" className="h-48 w-full" />
      ) : (
        <form onSubmit={handleOpenConfirm} className="space-y-6 max-w-lg font-sans">
          <Card className="bg-surface border border-border p-5 space-y-4">
            <h3 className="font-bold text-textPrimary text-sm border-b border-border pb-2">
              Security Parameters
            </h3>

            <div className="space-y-1 text-xs">
              <label className="font-semibold text-textSecondary block">Session Inactivity Timeout (Minutes)</label>
              <input
                type="number"
                required
                value={timeout}
                onChange={(e) => setTimeoutVal(Number(e.target.value))}
                className="w-full p-2.5 border border-border rounded bg-surface text-textPrimary text-xs focus:outline-none font-sans"
              />
            </div>

            <div className="space-y-1 text-xs">
              <label className="font-semibold text-textSecondary block">Max Login Fail Attempts before Lockout</label>
              <input
                type="number"
                required
                value={attempts}
                onChange={(e) => setAttempts(Number(e.target.value))}
                className="w-full p-2.5 border border-border rounded bg-surface text-textPrimary text-xs focus:outline-none font-sans"
              />
            </div>
          </Card>

          <Card className="bg-surface border border-border p-5 space-y-4">
            <h3 className="font-bold text-textPrimary text-sm border-b border-border pb-2">
              Log Retention Governance
            </h3>

            <div className="space-y-1 text-xs font-sans">
              <label className="font-semibold text-textSecondary block">Audit logs Retention (Days)</label>
              <input
                type="number"
                required
                value={retention}
                onChange={(e) => setRetention(Number(e.target.value))}
                className="w-full p-2.5 border border-border rounded bg-surface text-textPrimary text-xs focus:outline-none font-sans"
              />
            </div>
          </Card>

          <div className="flex justify-end">
            <Button type="submit" variant="primary" size="sm" className="font-bold">
              Save Platform Configuration
            </Button>
          </div>
        </form>
      )}

      {/* Dangerous settings Change confirmation Modal (FR-46) */}
      <Modal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        title="Confirm Governance Modifications"
        className="max-w-sm w-full font-sans"
      >
        <div className="space-y-4 text-xs font-sans text-left">
          <p className="text-textSecondary leading-relaxed font-sans font-medium">
            You are about to modify system security timeouts and data retention settings. Changing these parameters has audit consequences.
          </p>
          <div className="flex gap-2 justify-end pt-2 border-t border-border mt-4 font-sans">
            <button
              type="button"
              onClick={() => setShowConfirmModal(false)}
              disabled={isSubmitLoading}
              className="px-3.5 py-2 border border-border hover:bg-surfaceAlt text-textSecondary rounded text-xs font-semibold focus:outline-none"
            >
              Cancel
            </button>
            <Button
              type="button"
              variant="primary"
              size="sm"
              isLoading={isSubmitLoading}
              onClick={handleSave}
            >
              Confirm Changes
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
export default AdminSettingsPage;
