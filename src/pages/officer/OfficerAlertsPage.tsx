import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import caseService from '@/services/caseService';
import type { WelfareCase } from '@/services/caseService';
import AlertList from '@/components/officer/AlertList';
import CaseQuickView from '@/components/officer/CaseQuickView';
import Skeleton from '@/components/ui/Skeleton';

export const OfficerAlertsPage: React.FC = () => {
  const [selectedCase, setSelectedCase] = useState<WelfareCase | null>(null);

  const { data: alertsRes, isLoading, isError, refetch } = useQuery({
    queryKey: ['officer-alerts'],
    queryFn: () => caseService.getAlerts(),
  });

  const handleReview = async (caseId: string) => {
    try {
      const response = await caseService.getCaseById(caseId);
      setSelectedCase(response.data);
    } catch {
      // Ignore
    }
  };

  const handleUpdate = () => {
    refetch();
    if (selectedCase) {
      caseService.getCaseById(selectedCase.id).then((res) => setSelectedCase(res.data));
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton variant="line" className="h-8 w-1/4" />
        <Skeleton variant="card" className="h-20 w-full" />
        <Skeleton variant="card" className="h-20 w-full" />
      </div>
    );
  }

  const list = alertsRes?.data || [];

  return (
    <div className="space-y-6 select-none max-w-2xl mx-auto">
      <div>
        <h1 className="text-xl font-black text-textPrimary leading-tight">Priority Alerts</h1>
        <p className="text-xs text-textMuted mt-0.5">Welfare changes and action items that require immediate officer attention.</p>
      </div>

      {isError ? (
        <div className="bg-danger/10 border border-danger/20 text-danger text-xs font-semibold p-4 rounded-md text-center">
          Failed to load alerts. Please retry.
        </div>
      ) : (
        <div className="animate-fadeIn">
          <AlertList alerts={list} onReview={handleReview} />
        </div>
      )}

      {/* Slide Drawer Preview Overlay */}
      <CaseQuickView
        caseItem={selectedCase}
        onClose={() => setSelectedCase(null)}
        onUpdate={handleUpdate}
      />
    </div>
  );
};
export default OfficerAlertsPage;
