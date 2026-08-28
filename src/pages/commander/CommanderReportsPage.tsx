import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import commanderService from '@/services/commanderService';
import Card from '@/components/ui/Card';
import Select from '@/components/ui/Select';
import Button from '@/components/ui/Button';
import Skeleton from '@/components/ui/Skeleton';

export const CommanderReportsPage: React.FC = () => {
  const [selectedUnit, setSelectedUnit] = useState('UNIT-7');
  const [period, setPeriod] = useState('30d');
  const [isExporting, setIsExporting] = useState(false);

  const { data: reportRes, isLoading } = useQuery({
    queryKey: ['commander-report', selectedUnit, period],
    queryFn: () => commanderService.getReport(selectedUnit, period),
  });

  const handleExport = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      if (reportRes) {
        const report = reportRes.data;
        const text = `UNIT WELFARE REPORT\nUnit: ${report.unitName}\nPeriod: ${report.reportingPeriod}\nRisk Trend: ${report.riskTrend}\nScope Count: ${report.personnelInScope} personnel\n\nWorkload Metrics:\n${report.workloadMetrics.join('\n')}\n\nPressure Points:\n${report.pressurePoints.join('\n')}\n\nRecommendations:\n${report.recommendations.join('\n')}\n`;
        const blob = new Blob([text], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `Welfare_Report_${selectedUnit}.txt`;
        link.click();
        URL.revokeObjectURL(url);
      }
    }, 1000);
  };

  const unitOptions = [
    { label: 'Unit 1 (Active Support)', value: 'UNIT-1' },
    { label: 'Unit 2 (Tactical Logistics)', value: 'UNIT-2' },
    { label: 'Unit 4 (Engineering Base)', value: 'UNIT-4' },
    { label: 'Unit 7 (Tactical Operations)', value: 'UNIT-7' }
  ];

  const periodOptions = [
    { label: 'Last 7 Days', value: '7d' },
    { label: 'Last 30 Days', value: '30d' },
    { label: 'Last 90 Days', value: '90d' }
  ];

  return (
    <div className="space-y-6 select-none font-sans text-left animate-fadeIn">
      <div>
        <h1 className="text-xl font-black text-textPrimary leading-tight">Welfare Reports</h1>
        <p className="text-xs text-textMuted mt-0.5">Generate and download aggregate compliance summaries (FR-35).</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end bg-surface border border-border p-4 rounded-lg">
        <Select label="Reporting Scope" options={unitOptions} value={selectedUnit} onChange={(e) => setSelectedUnit(e.target.value)} />
        <Select label="Time Range" options={periodOptions} value={period} onChange={(e) => setPeriod(e.target.value)} />
        <Button variant="primary" size="sm" onClick={handleExport} isLoading={isExporting} className="font-bold">
          Export Report (FR-36)
        </Button>
      </div>

      {isLoading ? (
        <Skeleton variant="block" className="h-48 w-full" />
      ) : reportRes ? (
        <Card className="bg-surface border border-border p-6 space-y-6 font-sans">
          <div className="border-b border-border pb-3 flex justify-between items-start">
            <div>
              <h3 className="font-bold text-textPrimary text-base">Unit Welfare Report</h3>
              <p className="text-xs text-textMuted pt-0.5">Scope: <span className="text-textSecondary font-semibold">{reportRes.data.unitName}</span></p>
            </div>
            <span className="text-[10px] text-textMuted font-bold border border-border px-2 py-0.5 rounded bg-surfaceAlt uppercase">
              Reporting: {reportRes.data.reportingPeriod}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs leading-relaxed">
            <div className="space-y-3">
              <div>
                <span className="text-[9px] font-bold text-textMuted uppercase block">Risk summary & Trend</span>
                <p className="text-textSecondary font-bold">Welfare indicators direction: {reportRes.data.riskTrend}</p>
                <p className="text-textMuted font-medium pt-0.5">{reportRes.data.personnelInScope} total personnel tracked in range.</p>
              </div>

              <div>
                <span className="text-[9px] font-bold text-textMuted uppercase block">Workload indicators summary</span>
                <ul className="list-disc list-inside text-textSecondary font-medium space-y-1">
                  {reportRes.data.workloadMetrics.map((m, i) => (
                    <li key={i}>{m}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <span className="text-[9px] font-bold text-textMuted uppercase block">Current Associated Stressors</span>
                <ul className="list-disc list-inside text-textSecondary font-medium space-y-1">
                  {reportRes.data.pressurePoints.map((p, i) => (
                    <li key={i}>{p}</li>
                  ))}
                </ul>
              </div>

              <div>
                <span className="text-[9px] font-bold text-textMuted uppercase block">Organizational recommendations generated</span>
                <ul className="list-disc list-inside text-textSecondary font-medium space-y-1">
                  {reportRes.data.recommendations.map((r, i) => (
                    <li key={i}>{r}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </Card>
      ) : null}
    </div>
  );
};
export default CommanderReportsPage;
