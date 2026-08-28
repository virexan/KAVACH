import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import officerService from '@/services/officerService';
import caseService from '@/services/caseService';
import type { WelfareCase } from '@/services/caseService';
import OfficerDashboardHeader from '@/components/officer/OfficerDashboardHeader';
import OfficerMetricCard from '@/components/officer/OfficerMetricCard';
import RiskDistributionChart from '@/components/officer/RiskDistributionChart';
import RiskTrendSummary from '@/components/officer/RiskTrendSummary';
import PriorityCasesTable from '@/components/officer/PriorityCasesTable';
import CaseQuickView from '@/components/officer/CaseQuickView';
import ScopeSelector from '@/components/officer/ScopeSelector';
import Skeleton from '@/components/ui/Skeleton';
import ErrorState from '@/components/ui/ErrorState';

export const OfficerDashboardPage: React.FC = () => {
  const [scope, setScope] = useState('ALL');
  const [selectedCase, setSelectedCase] = useState<WelfareCase | null>(null);

  const { data: dashboardRes, isLoading: isDashLoading, isError: isDashError, refetch: refetchDash } = useQuery({
    queryKey: ['officer-dashboard', scope],
    queryFn: () => officerService.getDashboard(),
  });

  const { data: casesRes, isLoading: isCasesLoading, isError: isCasesError, refetch: refetchCases } = useQuery({
    queryKey: ['priority-cases', scope],
    queryFn: () => caseService.getCases({ pageSize: 5 }), // Load top 5 priority cases (FR-13)
  });

  const handleRetry = () => {
    refetchDash();
    refetchCases();
  };

  const handleUpdate = () => {
    refetchDash();
    refetchCases();
    if (selectedCase) {
      caseService.getCaseById(selectedCase.id).then((res) => setSelectedCase(res.data));
    }
  };

  if (isDashLoading || isCasesLoading) {
    return (
      <div className="space-y-6">
        <Skeleton variant="line" className="h-8 w-1/3" />
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-6">
          <Skeleton variant="card" />
          <Skeleton variant="card" />
          <Skeleton variant="card" />
          <Skeleton variant="card" />
          <Skeleton variant="card" />
        </div>
        <Skeleton variant="block" className="h-64" />
      </div>
    );
  }

  if (isDashError || isCasesError) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <ErrorState
          title="Failed to Load Dashboard"
          description="We couldn't load the welfare overview summary. Please verify connection and retry."
          retryLabel="Try Again"
          onRetry={handleRetry}
          className="max-w-md shadow-panel bg-surface border border-border"
        />
      </div>
    );
  }

  const dash = dashboardRes?.data;
  const cases = casesRes?.data || [];

  return (
    <div className="space-y-6 select-none font-sans">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <OfficerDashboardHeader scope={scope === 'ALL' ? 'All Units' : scope} />
        <ScopeSelector value={scope} onChange={setScope} />
      </div>

      {dash && (
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
          <OfficerMetricCard count={dash.monitoredPersonnel} label="Monitored Personnel" />
          <OfficerMetricCard count={dash.requiresReview} label="Requires Review" type="warning" description="Flagged cases awaiting evaluation" />
          <OfficerMetricCard count={dash.elevatedRisk} label="Elevated Risk" type="warning" />
          <OfficerMetricCard count={dash.highRisk} label="High Risk" type="danger" />
          <OfficerMetricCard count={dash.followUpsDue} label="Follow-Ups Due" type="danger" description="Scheduled actions due today" />
        </div>
      )}

      {dash && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <RiskDistributionChart distribution={dash.riskDistribution} />
          </div>
          <div className="lg:col-span-1">
            <RiskTrendSummary trend={dash.riskTrend} />
          </div>
        </div>
      )}

      <div className="space-y-3">
        <h3 className="text-sm font-bold text-textPrimary uppercase tracking-wider text-[10px]">
          Priority Cases Requiring Review
        </h3>
        
        {cases.length === 0 ? (
          <div className="text-center p-8 bg-surface border border-border rounded-lg text-xs text-textMuted font-medium">
            No priority cases currently require your attention. You're all caught up.
          </div>
        ) : (
          <PriorityCasesTable cases={cases} onSelectCase={setSelectedCase} />
        )}
      </div>

      {/* Slide Drawer Preview Overlay (FR-19) */}
      <CaseQuickView
        caseItem={selectedCase}
        onClose={() => setSelectedCase(null)}
        onUpdate={handleUpdate}
      />
    </div>
  );
};
export default OfficerDashboardPage;
