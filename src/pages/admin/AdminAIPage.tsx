import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import adminService from '@/services/adminService';
import type { ModelVersion } from '@/services/adminService';
import ModelVersionCard from '@/components/admin/ModelVersionCard';
import Skeleton from '@/components/ui/Skeleton';
import EmptyState from '@/components/ui/EmptyState';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';

export const AdminAIPage: React.FC = () => {
  const [selectedModel, setSelectedModel] = useState<ModelVersion | null>(null);
  const [showActivateModal, setShowActivateModal] = useState(false);
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);

  const { data: modelsRes, isLoading, isError, refetch } = useQuery({
    queryKey: ['admin-models-list'],
    queryFn: () => adminService.getModels(),
  });

  const handleActivateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedModel) return;
    setIsSubmitLoading(true);
    try {
      await adminService.activateModel(selectedModel.id);
      setShowActivateModal(false);
      refetch();
    } finally {
      setIsSubmitLoading(false);
    }
  };

  const list = modelsRes?.data || [];

  return (
    <div className="space-y-6 select-none font-sans text-left animate-fadeIn">
      <div>
        <h1 className="text-xl font-black text-textPrimary leading-tight">AI & Model Governance</h1>
        <p className="text-xs text-textMuted mt-0.5">Manage active risk-assessment versions and explainability inputs (FR-37).</p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Skeleton variant="card" />
          <Skeleton variant="card" />
        </div>
      ) : isError ? (
        <div className="bg-danger/10 border border-danger/20 text-danger text-xs font-semibold p-4 rounded-md text-center">
          Model catalog is temporarily unavailable. (FR-69)
        </div>
      ) : list.length === 0 ? (
        <EmptyState
          title="No model versions available"
          description="Model records are missing."
          className="bg-surface border border-border"
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {list.map((m) => (
            <ModelVersionCard
              key={m.id}
              model={m}
              onActivate={(model) => {
                setSelectedModel(model);
                setShowActivateModal(true);
              }}
            />
          ))}
        </div>
      )}

      {/* Model version Activation confirmation Modal */}
      <Modal
        isOpen={showActivateModal}
        onClose={() => setShowActivateModal(false)}
        title="Activate Risk Assessment Model"
        className="max-w-sm w-full font-sans"
      >
        {selectedModel && (
          <form onSubmit={handleActivateSubmit} className="space-y-4 font-sans text-left">
            <p className="text-xs text-textSecondary leading-relaxed">
              Are you sure you want to activate model version <strong>{selectedModel.name} ({selectedModel.version})</strong>?
              This will update the risk-assessment algorithms used across KAVACH (FR-40).
            </p>

            <div className="flex gap-2 justify-end pt-2 border-t border-border mt-4 font-sans">
              <button
                type="button"
                onClick={() => setShowActivateModal(false)}
                disabled={isSubmitLoading}
                className="px-3.5 py-2 border border-border hover:bg-surfaceAlt text-textSecondary rounded text-xs font-semibold focus:outline-none"
              >
                Cancel
              </button>
              <Button type="submit" variant="primary" size="sm" isLoading={isSubmitLoading}>
                Confirm Activation
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};
export default AdminAIPage;
