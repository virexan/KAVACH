import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import recommendationService from '@/services/recommendationService';
import type { Recommendation } from '@/services/recommendationService';
import interventionService from '@/services/interventionService';
import RecommendationCard from '@/components/officer/recommendations/RecommendationCard';
import RecommendationDetail from '@/components/officer/recommendations/RecommendationDetail';
import Select from '@/components/ui/Select';
import Skeleton from '@/components/ui/Skeleton';
import EmptyState from '@/components/ui/EmptyState';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';

export const OfficerRecommendationsPage: React.FC = () => {
  const [status, setStatus] = useState('ALL');
  const [priority, setPriority] = useState('ALL');
  const [category, setCategory] = useState('ALL');
  const [selectedRec, setSelectedRec] = useState<Recommendation | null>(null);

  // Follow-up Form states (FR-30)
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [followUpType, setFollowUpType] = useState('WELFARE_CONVERSATION');
  const [scheduledFor, setScheduledFor] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);

  const { data: recsRes, isLoading, isError, refetch } = useQuery({
    queryKey: ['officer-recommendations', status, priority, category],
    queryFn: () => recommendationService.getRecommendations({ status, priority, category }),
  });

  const handleUpdate = () => {
    refetch();
    if (selectedRec) {
      recommendationService.getRecommendationById(selectedRec.id).then((res) => setSelectedRec(res.data));
    }
  };

  const handleSaveFollowUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRec) return;
    setIsSubmitLoading(true);
    try {
      await interventionService.createFollowUp(selectedRec.caseId, {
        recommendationId: selectedRec.id,
        type: followUpType as any,
        scheduledFor,
        description: description.trim() || undefined,
      });
      setShowScheduleModal(false);
      handleUpdate();
    } catch {
      // Ignore
    } finally {
      setIsSubmitLoading(false);
    }
  };

  const statusOptions = [
    { label: 'All Statuses', value: 'ALL' },
    { label: 'New', value: 'NEW' },
    { label: 'Reviewed', value: 'REVIEWED' },
    { label: 'Accepted', value: 'ACCEPTED' },
    { label: 'Dismissed', value: 'DISMISSED' },
    { label: 'In Progress', value: 'IN_PROGRESS' },
    { label: 'Completed', value: 'COMPLETED' },
    { label: 'Expired', value: 'EXPIRED' }
  ];

  const priorityOptions = [
    { label: 'All Priorities', value: 'ALL' },
    { label: 'High', value: 'HIGH' },
    { label: 'Medium', value: 'MEDIUM' },
    { label: 'Low', value: 'LOW' }
  ];

  const categoryOptions = [
    { label: 'All Categories', value: 'ALL' },
    { label: 'Workload', value: 'WORKLOAD' },
    { label: 'Rest & Recovery', value: 'REST_AND_RECOVERY' },
    { label: 'Leave', value: 'LEAVE' },
    { label: 'Welfare Support', value: 'WELFARE_SUPPORT' },
    { label: 'Monitoring', value: 'MONITORING' },
    { label: 'General Wellbeing', value: 'GENERAL_WELLBEING' }
  ];

  const handleClearFilters = () => {
    setStatus('ALL');
    setPriority('ALL');
    setCategory('ALL');
  };

  const list = recsRes?.data || [];

  return (
    <div className="space-y-6 select-none font-sans text-left">
      <div>
        <h1 className="text-xl font-black text-textPrimary leading-tight">Recommendation Center</h1>
        <p className="text-xs text-textMuted mt-0.5">Human-gated welfare suggestions mapped from AI risk indicators.</p>
      </div>

      {/* Filter Toolbar (FR-9) */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-end bg-surface border border-border p-4 rounded-lg shadow-sm">
        <Select label="Filter Status" options={statusOptions} value={status} onChange={(e) => setStatus(e.target.value)} />
        <Select label="Filter Priority" options={priorityOptions} value={priority} onChange={(e) => setPriority(e.target.value)} />
        <Select label="Filter Category" options={categoryOptions} value={category} onChange={(e) => setCategory(e.target.value)} />
        <button
          onClick={handleClearFilters}
          className="w-full min-h-[40px] border border-dashed border-border hover:bg-surfaceAlt/60 text-textSecondary text-xs font-semibold rounded-md transition-colors focus:outline-none"
        >
          Clear Filters
        </button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Skeleton variant="card" />
          <Skeleton variant="card" />
        </div>
      ) : isError ? (
        <div className="bg-danger/10 border border-danger/20 text-danger text-xs font-semibold p-4 rounded-md text-center">
          Recommendation service temporarily unavailable. (FR-63)
        </div>
      ) : list.length === 0 ? (
        <EmptyState
          title="No recommendations"
          description="There are currently no supportive suggestions matching your filters."
          actionLabel="Clear Filters"
          onAction={handleClearFilters}
          className="bg-surface border border-border"
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-fadeIn">
          {list.map((rec) => (
            <RecommendationCard
              key={rec.id}
              recommendation={rec}
              onViewDetails={setSelectedRec}
            />
          ))}
        </div>
      )}

      {/* Details drawer overlay */}
      <RecommendationDetail
        recommendation={selectedRec}
        onClose={() => setSelectedRec(null)}
        onUpdate={handleUpdate}
        onCreateFollowUp={() => {
          setSelectedRec(null);
          setShowScheduleModal(true);
        }}
      />

      {/* Scheduled Dialog Modal */}
      <Modal
        isOpen={showScheduleModal}
        onClose={() => setShowScheduleModal(false)}
        title="Schedule Recommendation Follow-Up"
        className="max-w-md w-full"
      >
        {selectedRec && (
          <form onSubmit={handleSaveFollowUp} className="space-y-4 font-sans text-left">
            <div className="text-[10px] text-textMuted bg-surfaceAlt/60 p-2.5 rounded border border-border/80">
              Scheduling follow-up for case <strong>{selectedRec.personnelDisplayId}</strong> linked to recommendation:{' '}
              <em>"{selectedRec.title}"</em>.
            </div>

            <div className="space-y-1 text-xs">
              <label className="font-semibold text-textSecondary block">Follow-Up Type</label>
              <select
                value={followUpType}
                onChange={(e) => setFollowUpType(e.target.value)}
                className="w-full p-2.5 border border-border rounded bg-surface text-textPrimary text-xs focus:outline-none"
              >
                <option value="WELFARE_CONVERSATION">Welfare Conversation</option>
                <option value="SUPPORT_RESOURCES">Explore Support Resources</option>
                <option value="WORKLOAD_REVIEW">Review Active Duty Workloads</option>
                <option value="GENERAL_CHECK_IN">General Check-In Session</option>
              </select>
            </div>

            <div className="space-y-1 text-xs font-sans">
              <label className="font-semibold text-textSecondary block">Target Date</label>
              <input
                type="date"
                required
                value={scheduledFor}
                onChange={(e) => setScheduledFor(e.target.value)}
                className="w-full p-2.5 border border-border rounded bg-surface text-textPrimary text-xs focus:outline-none"
              />
            </div>

            <div className="space-y-1 text-xs font-sans">
              <label className="font-semibold text-textSecondary block">Notes (Optional)</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Follow-up context details..."
                className="w-full p-2.5 border border-border rounded bg-surface text-textPrimary text-xs focus:outline-none h-20 resize-none"
              />
            </div>

            <div className="flex gap-2 justify-end pt-2 border-t border-border mt-4">
              <button
                type="button"
                onClick={() => setShowScheduleModal(false)}
                disabled={isSubmitLoading}
                className="px-3.5 py-2 border border-border hover:bg-surfaceAlt text-textSecondary rounded text-xs font-semibold focus:outline-none font-sans"
              >
                Cancel
              </button>
              <Button
                type="submit"
                variant="primary"
                size="sm"
                className="font-bold"
                isLoading={isSubmitLoading}
              >
                Schedule Follow-Up
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};
export default OfficerRecommendationsPage;
