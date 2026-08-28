import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import interventionService from '@/services/interventionService';
import type { FollowUp, OutcomeType } from '@/services/interventionService';
import caseService from '@/services/caseService';
import InterventionFilters from '@/components/officer/interventions/InterventionFilters';
import InterventionTable from '@/components/officer/interventions/InterventionTable';
import OutcomeForm from '@/components/officer/interventions/OutcomeForm';
import OutcomeSummary from '@/components/officer/interventions/OutcomeSummary';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import Skeleton from '@/components/ui/Skeleton';
import EmptyState from '@/components/ui/EmptyState';

export const OfficerInterventionsPage: React.FC = () => {
  const [filters, setFilters] = useState({
    status: 'ALL',
    type: 'ALL',
  });

  const [selectedInt, setSelectedInt] = useState<FollowUp | null>(null);
  
  // Modal states
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showOutcomeForm, setShowOutcomeForm] = useState(false);
  const [showOutcomeDetail, setShowOutcomeDetail] = useState(false);

  // Form states
  const [rescheduleDate, setRescheduleDate] = useState('');
  const [cancelReason, setCancelReason] = useState('');
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);

  const { data: followUpsRes, isLoading, isError, refetch } = useQuery({
    queryKey: ['officer-followups-center', filters],
    queryFn: () => interventionService.getFollowUps({ status: filters.status, type: filters.type }),
  });

  const handleStart = async (id: string) => {
    await interventionService.updateFollowUp(id, { status: 'IN_PROGRESS' });
    refetch();
  };

  const handleRescheduleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInt) return;
    setIsSubmitLoading(true);
    try {
      await interventionService.updateFollowUp(selectedInt.id, {
        scheduledFor: rescheduleDate,
        notes: `Rescheduled to ${rescheduleDate}.`,
      });
      setShowRescheduleModal(false);
      refetch();
    } finally {
      setIsSubmitLoading(false);
    }
  };

  const handleCancelSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInt) return;
    setIsSubmitLoading(true);
    try {
      await interventionService.updateFollowUp(selectedInt.id, {
        status: 'CANCELLED',
        notes: cancelReason.trim() ? `Cancelled: ${cancelReason}` : 'Cancelled by officer.',
      });
      setShowCancelModal(false);
      refetch();
    } finally {
      setIsSubmitLoading(false);
    }
  };

  const handleOutcomeSubmit = async (data: { outcome: OutcomeType; notes?: string; nextReviewDate?: string }) => {
    if (!selectedInt) return;
    
    await interventionService.recordOutcome(selectedInt.id, data);
    
    // If Continue Monitoring is selected, shift case status to MONITORING (FR-35)
    if (data.outcome === 'CONTINUE_MONITORING') {
      await caseService.markCaseMonitoring(selectedInt.caseId);
      if (data.nextReviewDate) {
        await caseService.createFollowUp(selectedInt.caseId, {
          type: 'MONITORING',
          scheduledFor: data.nextReviewDate,
          notes: 'Next scheduled review'
        });
      }
    }
    
    refetch();
  };

  const handleClearFilters = () => {
    setFilters({ status: 'ALL', type: 'ALL' });
  };

  const list = followUpsRes?.data || [];
  const isFilteringActive = filters.status !== 'ALL' || filters.type !== 'ALL';

  return (
    <div className="space-y-6 select-none font-sans text-left">
      <div>
        <h1 className="text-xl font-black text-textPrimary leading-tight">Intervention Center</h1>
        <p className="text-xs text-textMuted mt-0.5">Track, start, and log outcomes for scheduled welfare conversations.</p>
      </div>

      {/* Filter toolbar (FR-28) */}
      <div className="bg-surface border border-border p-4 rounded-lg shadow-sm">
        <InterventionFilters
          filters={filters}
          onChange={setFilters}
          onClear={handleClearFilters}
        />
      </div>

      {isLoading ? (
        <Skeleton variant="block" className="h-48 w-full" />
      ) : isError ? (
        <div className="bg-danger/10 border border-danger/20 text-danger text-xs font-semibold p-4 rounded-md text-center">
          Intervention service unavailable. Please retry. (FR-63)
        </div>
      ) : list.length === 0 ? (
        <EmptyState
          title={isFilteringActive ? "No interventions match filters" : "No interventions yet"}
          description={isFilteringActive ? "Clear filters to view all follow-ups." : "Follow-ups scheduled from case profiles appear here."}
          actionLabel="Clear Filters"
          onAction={handleClearFilters}
          className="bg-surface border border-border"
        />
      ) : (
        <div className="animate-fadeIn">
          <InterventionTable
            interventions={list}
            onStart={handleStart}
            onComplete={(int) => {
              setSelectedInt(int);
              setShowOutcomeForm(true);
            }}
            onReschedule={(int) => {
              setSelectedInt(int);
              setRescheduleDate(int.scheduledFor ? int.scheduledFor.split('T')[0] : '');
              setShowRescheduleModal(true);
            }}
            onCancel={(int) => {
              setSelectedInt(int);
              setCancelReason('');
              setShowCancelModal(true);
            }}
            onViewOutcome={(int) => {
              setSelectedInt(int);
              setShowOutcomeDetail(true);
            }}
          />
        </div>
      )}

      {/* Reschedule Modal (FR-44) */}
      <Modal
        isOpen={showRescheduleModal}
        onClose={() => setShowRescheduleModal(false)}
        title="Reschedule Follow-Up Date"
        className="max-w-sm w-full"
      >
        {selectedInt && (
          <form onSubmit={handleRescheduleSubmit} className="space-y-4 font-sans text-left">
            <div className="space-y-1 text-xs">
              <label className="font-semibold text-textSecondary block">New Target Date</label>
              <input
                type="date"
                required
                value={rescheduleDate}
                onChange={(e) => setRescheduleDate(e.target.value)}
                className="w-full p-2.5 border border-border rounded bg-surface text-textPrimary text-xs focus:outline-none"
              />
            </div>
            <div className="flex gap-2 justify-end pt-2 border-t border-border mt-4">
              <button
                type="button"
                onClick={() => setShowRescheduleModal(false)}
                disabled={isSubmitLoading}
                className="px-3.5 py-2 border border-border hover:bg-surfaceAlt text-textSecondary rounded text-xs font-semibold focus:outline-none font-sans"
              >
                Cancel
              </button>
              <Button type="submit" variant="primary" size="sm" isLoading={isSubmitLoading}>
                Reschedule
              </Button>
            </div>
          </form>
        )}
      </Modal>

      {/* Cancel Modal (FR-45) */}
      <Modal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        title="Cancel Scheduled Follow-Up"
        className="max-w-sm w-full"
      >
        {selectedInt && (
          <form onSubmit={handleCancelSubmit} className="space-y-4 font-sans text-left">
            <p className="text-xs text-textSecondary leading-relaxed">
              This action will cancel the scheduled follow-up but preserve its history.
            </p>
            <div className="space-y-1 text-xs font-sans">
              <label className="font-semibold text-textSecondary block">Cancellation Reason (Optional)</label>
              <textarea
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="Reason..."
                className="w-full p-2.5 border border-border rounded bg-surface text-textPrimary text-xs focus:outline-none h-16 resize-none"
              />
            </div>
            <div className="flex gap-2 justify-end pt-2 border-t border-border mt-4">
              <button
                type="button"
                onClick={() => setShowCancelModal(false)}
                disabled={isSubmitLoading}
                className="px-3.5 py-2 border border-border hover:bg-surfaceAlt text-textSecondary rounded text-xs font-semibold focus:outline-none font-sans"
              >
                Cancel
              </button>
              <Button type="submit" variant="danger" size="sm" isLoading={isSubmitLoading}>
                Confirm Cancellation
              </Button>
            </div>
          </form>
        )}
      </Modal>

      {/* Outcome Completion Modal */}
      <OutcomeForm
        isOpen={showOutcomeForm}
        onClose={() => setShowOutcomeForm(false)}
        onSubmit={handleOutcomeSubmit}
      />

      {/* Outcome Detail Modal */}
      <Modal
        isOpen={showOutcomeDetail}
        onClose={() => setShowOutcomeDetail(false)}
        title={`Follow-Up Complete — ${selectedInt?.personnelDisplayId}`}
        className="max-w-md w-full"
      >
        {selectedInt?.outcome && (
          <div className="space-y-4 font-sans text-left">
            <OutcomeSummary outcome={selectedInt.outcome} />
            <div className="flex justify-end pt-2 border-t border-border mt-4">
              <Button variant="secondary" size="sm" onClick={() => setShowOutcomeDetail(false)}>
                Close
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
export default OfficerInterventionsPage;
