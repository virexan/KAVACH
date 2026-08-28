import React from 'react';

interface Props {
  selectedUnit: string;
  selectedPeriod: string;
  updatedAt: string;
  onChangeUnit: (unit: string) => void;
  onChangePeriod: (period: string) => void;
}

export const CommanderHeader: React.FC<Props> = ({
  selectedUnit,
  selectedPeriod,
  updatedAt,
  onChangeUnit,
  onChangePeriod
}) => {
  const units = [
    { label: 'All Authorized Units', value: 'ALL' },
    { label: 'Unit 1 (Active Duty Support)', value: 'UNIT-1' },
    { label: 'Unit 2 (Tactical Logistics)', value: 'UNIT-2' },
    { label: 'Unit 3 (Small Guard Section)', value: 'UNIT-3' },
    { label: 'Unit 4 (Engineering Base)', value: 'UNIT-4' },
    { label: 'Unit 7 (Tactical Operations Group)', value: 'UNIT-7' }
  ];

  const periods = [
    { label: '7 Days', value: '7d' },
    { label: '30 Days', value: '30d' },
    { label: '90 Days', value: '90d' }
  ];

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-border pb-4 select-none font-sans text-left animate-fadeIn">
      <div>
        <h1 className="text-2xl font-black text-textPrimary leading-tight">Unit Welfare Intelligence</h1>
        <p className="text-xs text-textMuted mt-0.5">
          Aggregate organizational metrics. Last updated: <span className="font-semibold text-textSecondary">{new Date(updatedAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
        </p>
      </div>

      <div className="flex flex-wrap gap-3 items-center w-full md:w-auto">
        <div className="space-y-0.5 text-left w-full sm:w-48">
          <label className="text-[10px] font-bold text-textMuted uppercase tracking-wide">Scope Selector (FR-40)</label>
          <select
            value={selectedUnit}
            onChange={(e) => onChangeUnit(e.target.value)}
            className="w-full p-2 border border-border rounded bg-surface text-textPrimary text-xs focus:outline-none font-semibold"
          >
            {units.map((u) => (
              <option key={u.value} value={u.value}>{u.label}</option>
            ))}
          </select>
        </div>

        <div className="space-y-0.5 text-left w-full sm:w-32">
          <label className="text-[10px] font-bold text-textMuted uppercase tracking-wide">Reporting Period (FR-41)</label>
          <select
            value={selectedPeriod}
            onChange={(e) => onChangePeriod(e.target.value)}
            className="w-full p-2 border border-border rounded bg-surface text-textPrimary text-xs focus:outline-none font-semibold"
          >
            {periods.map((p) => (
              <option key={p.value} value={p.value}>{p.label}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};
export default CommanderHeader;
