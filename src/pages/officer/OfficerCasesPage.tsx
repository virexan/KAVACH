import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import caseService from '@/services/caseService';
import type { WelfareCase } from '@/services/caseService';
import PriorityCasesTable from '@/components/officer/PriorityCasesTable';
import CaseFilters from '@/components/officer/CaseFilters';
import CaseSearch from '@/components/officer/CaseSearch';
import CaseQuickView from '@/components/officer/CaseQuickView';
import Skeleton from '@/components/ui/Skeleton';
import EmptyState from '@/components/ui/EmptyState';
import Button from '@/components/ui/Button';

export const OfficerCasesPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const [filters, setFilters] = useState({
    riskLevel: 'ALL',
    trend: 'ALL',
    followUpStatus: 'ALL',
  });

  const [selectedCase, setSelectedCase] = useState<WelfareCase | null>(null);

  const { data: casesRes, isLoading, isError, refetch } = useQuery({
    queryKey: ['officer-cases', search, filters, page],
    queryFn: () =>
      caseService.getCases({
        search,
        riskLevel: filters.riskLevel,
        trend: filters.trend,
        followUpStatus: filters.followUpStatus,
        page,
        pageSize,
      }),
  });

  const handleClearFilters = () => {
    setFilters({
      riskLevel: 'ALL',
      trend: 'ALL',
      followUpStatus: 'ALL',
    });
    setSearch('');
    setPage(1);
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
        <Skeleton variant="block" className="h-48 w-full" />
      </div>
    );
  }

  const cases = casesRes?.data || [];
  const total = casesRes?.meta?.total || 0;
  const hasMore = page * pageSize < total;
  const hasPrev = page > 1;

  const isFilteringActive = 
    filters.riskLevel !== 'ALL' || 
    filters.trend !== 'ALL' || 
    filters.followUpStatus !== 'ALL' || 
    search !== '';

  return (
    <div className="space-y-6 select-none font-sans">
      <div>
        <h1 className="text-xl font-black text-textPrimary leading-tight">Welfare Case Directory</h1>
        <p className="text-xs text-textMuted mt-0.5">Filter, review, and schedule interventions for scope-authorized cases.</p>
      </div>

      {/* Search & Filters */}
      <div className="space-y-4 bg-surface border border-border p-4 rounded-lg shadow-sm">
        <CaseSearch value={search} onChange={(val) => { setSearch(val); setPage(1); }} />
        <CaseFilters
          filters={filters}
          onChange={(f) => { setFilters(f); setPage(1); }}
          onClear={handleClearFilters}
        />
      </div>

      {isError ? (
        <div className="bg-danger/10 border border-danger/20 text-danger text-xs font-semibold p-4 rounded-md text-center">
          Failed to load case records. Please retry.
        </div>
      ) : cases.length === 0 ? (
        <EmptyState
          title={isFilteringActive ? "No cases matching filter" : "No cases"}
          description={isFilteringActive ? "No cases match your current filters. Clear them to view all cases." : "No case logs exist."}
          actionLabel="Clear Filters"
          onAction={handleClearFilters}
          className="bg-surface border border-border"
        />
      ) : (
        <div className="space-y-4 animate-fadeIn">
          <PriorityCasesTable cases={cases} onSelectCase={setSelectedCase} />

          {/* Pagination Controls */}
          {total > pageSize && (
            <div className="flex justify-between items-center pt-2">
              <span className="text-xs text-textMuted font-semibold">
                Page {page} of {Math.ceil(total / pageSize)} ({total} total cases)
              </span>
              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  disabled={!hasPrev}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                >
                  Previous
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  disabled={!hasMore}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
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
export default OfficerCasesPage;
