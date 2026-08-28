import React from 'react';
import Select from '../ui/Select';

interface Filters {
  riskLevel: string;
  trend: string;
  followUpStatus: string;
}

interface Props {
  filters: Filters;
  onChange: (filters: Filters) => void;
  onClear: () => void;
}

export const CaseFilters: React.FC<Props> = ({ filters, onChange, onClear }) => {
  const riskOptions = [
    { label: 'All Risks', value: 'ALL' },
    { label: 'Low', value: 'LOW' },
    { label: 'Moderate', value: 'MODERATE' },
    { label: 'Elevated', value: 'ELEVATED' },
    { label: 'High', value: 'HIGH' },
    { label: 'Insufficient Data', value: 'INSUFFICIENT_DATA' },
  ];

  const trendOptions = [
    { label: 'All Trajectories', value: 'ALL' },
    { label: 'Improving', value: 'IMPROVING' },
    { label: 'Stable', value: 'STABLE' },
    { label: 'Increasing', value: 'INCREASING' },
    { label: 'Insufficient Data', value: 'INSUFFICIENT_DATA' },
  ];

  const followUpOptions = [
    { label: 'All Follow-Ups', value: 'ALL' },
    { label: 'Not Required', value: 'NOT_REQUIRED' },
    { label: 'Required', value: 'REQUIRED' },
    { label: 'Due', value: 'DUE' },
    { label: 'In Progress', value: 'IN_PROGRESS' },
    { label: 'Completed', value: 'COMPLETED' },
  ];

  const handleChange = (key: keyof Filters, value: string) => {
    onChange({
      ...filters,
      [key]: value,
    });
  };

  return (
    <div className="w-full grid grid-cols-1 sm:grid-cols-4 gap-4 items-end select-none animate-fadeIn">
      <Select
        label="Risk Level"
        options={riskOptions}
        value={filters.riskLevel}
        onChange={(e) => handleChange('riskLevel', e.target.value)}
      />
      <Select
        label="Trajectory Trend"
        options={trendOptions}
        value={filters.trend}
        onChange={(e) => handleChange('trend', e.target.value)}
      />
      <Select
        label="Follow-Up Status"
        options={followUpOptions}
        value={filters.followUpStatus}
        onChange={(e) => handleChange('followUpStatus', e.target.value)}
      />
      
      <button
        onClick={onClear}
        className="w-full min-h-[40px] border border-dashed border-border hover:bg-surfaceAlt/60 text-textSecondary text-xs font-semibold rounded-md transition-colors focus:outline-none"
      >
        Clear Filters
      </button>
    </div>
  );
};
export default CaseFilters;
