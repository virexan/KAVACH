import React from 'react';
import Select from '../../ui/Select';

interface Filters {
  status: string;
  type: string;
}

interface Props {
  filters: Filters;
  onChange: (f: Filters) => void;
  onClear: () => void;
}

export const InterventionFilters: React.FC<Props> = ({ filters, onChange, onClear }) => {
  const statusOptions = [
    { label: 'All Statuses', value: 'ALL' },
    { label: 'Scheduled', value: 'SCHEDULED' },
    { label: 'Due', value: 'DUE' },
    { label: 'In Progress', value: 'IN_PROGRESS' },
    { label: 'Completed', value: 'COMPLETED' },
    { label: 'Cancelled', value: 'CANCELLED' }
  ];

  const typeOptions = [
    { label: 'All Types', value: 'ALL' },
    { label: 'Welfare Conversation', value: 'WELFARE_CONVERSATION' },
    { label: 'General Check-In', value: 'GENERAL_CHECK_IN' },
    { label: 'Support Resources', value: 'SUPPORT_RESOURCES' },
    { label: 'Workload Review', value: 'WORKLOAD_REVIEW' },
    { label: 'Leave Review', value: 'LEAVE_REVIEW' },
    { label: 'Monitoring', value: 'MONITORING' },
    { label: 'Other', value: 'OTHER' }
  ];

  const handleChange = (key: keyof Filters, value: string) => {
    onChange({
      ...filters,
      [key]: value
    });
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end select-none animate-fadeIn font-sans">
      <Select
        label="Intervention Status"
        options={statusOptions}
        value={filters.status}
        onChange={(e) => handleChange('status', e.target.value)}
      />
      <Select
        label="Intervention Type"
        options={typeOptions}
        value={filters.type}
        onChange={(e) => handleChange('type', e.target.value)}
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
export default InterventionFilters;
