import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import adminService from '@/services/adminService';
import type { ConsentPolicy } from '@/services/adminService';
import ConsentPolicyTable from '@/components/admin/ConsentPolicyTable';
import Skeleton from '@/components/ui/Skeleton';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';

export const AdminConsentPage: React.FC = () => {
  const [selectedPolicy, setSelectedPolicy] = useState<ConsentPolicy | null>(null);
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);

  const { data: policiesRes, isLoading, refetch } = useQuery({
    queryKey: ['admin-consent-policies'],
    queryFn: () => adminService.getConsentPolicies(),
  });

  const handlePublishSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPolicy) return;
    setIsSubmitLoading(true);
    try {
      await adminService.publishConsentPolicy(selectedPolicy.id);
      setShowPublishModal(false);
      refetch();
    } finally {
      setIsSubmitLoading(false);
    }
  };

  const list = policiesRes?.data || [];

  return (
    <div className="space-y-6 select-none font-sans text-left animate-fadeIn">
      <div>
        <h1 className="text-xl font-black text-textPrimary leading-tight">Consent Governance</h1>
        <p className="text-xs text-textMuted mt-0.5">Manage policy declarations and data usage versions (FR-27).</p>
      </div>

      {isLoading ? (
        <Skeleton variant="block" className="h-48 w-full" />
      ) : (
        <div className="animate-fadeIn">
          <ConsentPolicyTable
            policies={list}
            onPublish={(policy) => {
              setSelectedPolicy(policy);
              setShowPublishModal(true);
            }}
          />
        </div>
      )}

      {/* Consent policy Publish confirmation Modal */}
      <Modal
        isOpen={showPublishModal}
        onClose={() => setShowPublishModal(false)}
        title="Publish Consent Policy"
        className="max-w-sm w-full"
      >
        {selectedPolicy && (
          <form onSubmit={handlePublishSubmit} className="space-y-4 font-sans text-left">
            <p className="text-xs text-textSecondary leading-relaxed font-sans">
              Are you sure you want to activate the consent policy <strong>{selectedPolicy.name} ({selectedPolicy.version})</strong>?
            </p>

            <div className="flex gap-2 justify-end pt-2 border-t border-border mt-4 font-sans">
              <button
                type="button"
                onClick={() => setShowPublishModal(false)}
                disabled={isSubmitLoading}
                className="px-3.5 py-2 border border-border hover:bg-surfaceAlt text-textSecondary rounded text-xs font-semibold focus:outline-none"
              >
                Cancel
              </button>
              <Button type="submit" variant="primary" size="sm" isLoading={isSubmitLoading}>
                Publish
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};
export default AdminConsentPage;
