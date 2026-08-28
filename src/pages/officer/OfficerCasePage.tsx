import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import caseService from '@/services/caseService';
import recommendationService from '@/services/recommendationService';
import interventionService from '@/services/interventionService';
import type { RiskFactor } from '@/services/caseService';
import ProfileHeader from '@/components/officer/profile/ProfileHeader';
import CurrentRiskCard from '@/components/officer/profile/CurrentRiskCard';
import RiskTrajectory from '@/components/officer/profile/RiskTrajectory';
import RiskHistoryChart from '@/components/officer/profile/RiskHistoryChart';
import RiskExplanation from '@/components/officer/profile/RiskExplanation';
import ContributingFactors from '@/components/officer/profile/ContributingFactors';
import FactorDetailDrawer from '@/components/officer/profile/FactorDetailDrawer';
import DataFreshness from '@/components/officer/profile/DataFreshness';
import WellnessTrendChart from '@/components/officer/profile/WellnessTrendChart';
import WorkloadTrendChart from '@/components/officer/profile/WorkloadTrendChart';
import RecentChangesTimeline from '@/components/officer/profile/RecentChangesTimeline';
import RecommendationPreview from '@/components/officer/profile/RecommendationPreview';
import FollowUpSummary from '@/components/officer/profile/FollowUpSummary';
import FollowUpTimeline from '@/components/officer/profile/FollowUpTimeline';
import ProfileActionBar from '@/components/officer/profile/ProfileActionBar';
import InsufficientDataState from '@/components/officer/profile/InsufficientDataState';
import MonitoringBanner from '@/components/officer/interventions/MonitoringBanner';
import Skeleton from '@/components/ui/Skeleton';
import ErrorState from '@/components/ui/ErrorState';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';

export const OfficerCasePage: React.FC = () => {
  const { caseId } = useParams<{ caseId: string }>();
  const navigate = useNavigate();

  const [selectedFactor, setSelectedFactor] = useState<RiskFactor | null>(null);
  const [showScheduleModal, setShowScheduleModal] = useState(false);

  // Form states for follow-up (FR-30)
  const [followUpType, setFollowUpType] = useState('WELFARE_CONVERSATION');
  const [scheduledFor, setScheduledFor] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);

  // TanStack Queries (FR-71)
  const { data: profileRes, isLoading: isProfileLoading, isError: isProfileError, refetch: refetchProfile } = useQuery({
    queryKey: ['officer-case-profile', caseId],
    queryFn: () => caseService.getCaseProfile(caseId!),
    enabled: !!caseId,
  });

  const { data: recsRes, refetch: refetchRecs } = useQuery({
    queryKey: ['profile-recommendations', caseId],
    queryFn: () => recommendationService.getRecommendations({ caseId }),
    enabled: !!caseId,
  });

  const { data: followUpsRes, refetch: refetchFollowUps } = useQuery({
    queryKey: ['profile-followups', caseId],
    queryFn: () => interventionService.getFollowUps({ caseId }),
    enabled: !!caseId,
  });

  const handleAcknowledge = async () => {
    if (!caseId) return;
    await caseService.acknowledgeCase(caseId);
    refetchProfile();
    refetchFollowUps();
  };

  const handleMarkMonitoring = async () => {
    if (!caseId) return;
    await caseService.markCaseMonitoring(caseId);
    refetchProfile();
    refetchFollowUps();
  };

  const handleSaveFollowUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!caseId) return;
    setIsSubmitLoading(true);
    try {
      await interventionService.createFollowUp(caseId, {
        type: followUpType as any,
        scheduledFor,
        description: notes.trim() || undefined,
      });
      setShowScheduleModal(false);
      refetchProfile();
      refetchFollowUps();
      refetchRecs();
    } catch {
      // Ignore
    } finally {
      setIsSubmitLoading(false);
    }
  };

  if (isProfileLoading) {
    return (
      <div className="space-y-6">
        <Skeleton variant="line" className="h-8 w-1/3" />
        <Skeleton variant="block" className="h-48 w-full" />
      </div>
    );
  }

  if (isProfileError || !profileRes) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <ErrorState
          title="Profile Load Failed"
          description="We couldn't retrieve this personnel's welfare risk profile. Please try again."
          retryLabel="Try Again"
          onRetry={() => refetchProfile()}
          className="max-w-md bg-surface border border-border"
        />
      </div>
    );
  }

  const profile = profileRes.data;
  const recs = recsRes?.data || [];
  const followUps = followUpsRes?.data || [];

  // Mount insufficient state if data is missing (FR-37)
  if (profile.risk.level === 'INSUFFICIENT_DATA') {
    return (
      <InsufficientDataState
        personnelDisplayId={profile.personnel.displayId}
        onBack={() => navigate('/officer/cases')}
      />
    );
  }

  // Active follow up summary fields
  const activeFollowUp = followUps.find((f) => f.status === 'SCHEDULED' || f.status === 'DUE' || f.status === 'IN_PROGRESS');

  // Build combined case history timeline (FR-34)
  const combinedTimeline = [
    ...profile.timeline,
    ...followUps.map((f) => ({
      date: f.completedAt || f.createdAt,
      label: `Follow-Up: ${f.type.replace(/_/g, ' ')} (${f.status})`,
      description: f.notes
    }))
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="space-y-6 select-none font-sans text-left">
      {/* Header (FR-8) */}
      <ProfileHeader profile={profile} onBack={() => navigate('/officer/cases')} />

      {/* Monitoring active alert banners (FR-35) */}
      {profile.status === 'MONITORING' && (
        <MonitoringBanner nextReviewDate={activeFollowUp?.scheduledFor} />
      )}

      {/* Action panel (FR-31) */}
      <ProfileActionBar
        status={profile.status}
        onAcknowledge={handleAcknowledge}
        onMarkMonitoring={handleMarkMonitoring}
        onScheduleFollowUp={() => setShowScheduleModal(true)}
      />

      {/* Current Risk Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <CurrentRiskCard risk={profile.risk} />
        <RiskTrajectory trend={profile.risk.trend} />
      </div>

      {/* Categorical History Grids (FR-13) */}
      <RiskHistoryChart history={profile.riskHistory30D} />

      {/* Factors and Explanations (FR-15, FR-16) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RiskExplanation summaryText={profile.risk.summary || ''} />
        </div>
        <div className="lg:col-span-1">
          <ContributingFactors factors={profile.contributingFactors} onSelectFactor={setSelectedFactor} />
        </div>
      </div>

      {/* Freshness tracking logs (FR-21) */}
      <DataFreshness freshness={profile.dataFreshness} />

      {/* Line trends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <WellnessTrendChart caseId={profile.id} />
        <WorkloadTrendChart caseId={profile.id} />
      </div>

      {/* Timelines and recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentChangesTimeline events={profile.recentChanges} />
        <FollowUpTimeline timeline={combinedTimeline} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecommendationPreview recommendations={recs} />
        <FollowUpSummary
          followUp={
            activeFollowUp
              ? {
                  status: activeFollowUp.status as any,
                  date: activeFollowUp.scheduledFor,
                  type: activeFollowUp.type,
                  notes: activeFollowUp.notes,
                }
              : undefined
          }
          onCreate={() => setShowScheduleModal(true)}
        />
      </div>

      {/* Factor details side drawer (FR-19) */}
      <FactorDetailDrawer factor={selectedFactor} onClose={() => setSelectedFactor(null)} />

      {/* Schedule Follow-up Modal (FR-30, FR-48) */}
      <Modal
        isOpen={showScheduleModal}
        onClose={() => setShowScheduleModal(false)}
        title={`Schedule Follow-Up — ${profile.personnel.displayId}`}
        className="max-w-md w-full"
      >
        <form onSubmit={handleSaveFollowUp} className="space-y-4 font-sans text-left">
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
            <label className="font-semibold text-textSecondary block">Confidential Notes (Optional)</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Private evaluation notes for reference..."
              className="w-full p-2.5 border border-border rounded bg-surface text-textPrimary text-xs focus:outline-none h-20 resize-none font-sans"
            />
          </div>

          <div className="flex gap-2 justify-end pt-2 border-t border-border mt-4">
            <button
              type="button"
              onClick={() => setShowScheduleModal(false)}
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
              Save Follow-Up
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
export default OfficerCasePage;
