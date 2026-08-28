import React, { useState } from 'react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import TextArea from '@/components/ui/TextArea';
import Select from '@/components/ui/Select';
import Checkbox from '@/components/ui/Checkbox';
import RadioGroup from '@/components/ui/RadioGroup';
import Toggle from '@/components/ui/Toggle';
import Slider from '@/components/ui/Slider';
import Card from '@/components/ui/Card';
import Panel from '@/components/ui/Panel';
import SectionHeader from '@/components/ui/SectionHeader';
import Table from '@/components/ui/Table';
import Tabs from '@/components/ui/Tabs';
import Badge from '@/components/ui/Badge';
import RiskBadge from '@/components/ui/RiskBadge';
import Modal from '@/components/ui/Modal';
import Drawer from '@/components/ui/Drawer';
import Tooltip from '@/components/ui/Tooltip';
import Popover from '@/components/ui/Popover';
import Skeleton from '@/components/ui/Skeleton';
import EmptyState from '@/components/ui/EmptyState';
import ErrorState from '@/components/ui/ErrorState';
import StatCard from '@/components/ui/StatCard';
import useToast from '@/hooks/useToast';
import { mockResolve } from '@/lib/mockAdapter';

// Crash test helper component
const CrashyComponent: React.FC<{ shouldCrash: boolean }> = ({ shouldCrash }) => {
  if (shouldCrash) {
    throw new Error('Forced Developer Render Crash Test - Error Boundary caught this successfully.');
  }
  return <p className="text-xs text-textMuted select-none">No crash triggered yet.</p>;
};

export const ComponentShowcasePage: React.FC = () => {
  const toast = useToast();

  // Interactive component states
  const [inputText, setInputText] = useState('');
  const [selectVal, setSelectVal] = useState('1');
  const [checkboxVal, setCheckboxVal] = useState(false);
  const [radioVal, setRadioVal] = useState('opt1');
  const [toggleVal, setToggleVal] = useState(false);
  const [sliderVal, setSliderVal] = useState(5);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('tab1');

  // Simulated API fetch states
  const [apiData, setApiData] = useState<any[] | null>(null);
  const [apiLoading, setApiLoading] = useState(false);

  // Crash trigger state
  const [shouldCrash, setShouldCrash] = useState(false);

  // Sample Table parameters
  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Name' },
    { key: 'role', label: 'Role' },
    {
      key: 'risk',
      label: 'Risk Indicator',
      render: (row: any) => <RiskBadge level={row.risk} />,
    },
  ];

  const tableData = [
    { id: '1021', name: 'Demo Personnel A', role: 'Infantry Operator', risk: 'LOW' },
    { id: '1024', name: 'Demo Personnel B', role: 'Support Staff', risk: 'MODERATE' },
    { id: '1029', name: 'Demo Personnel C', role: 'Field Specialist', risk: 'ELEVATED' },
    { id: '1035', name: 'Demo Personnel D', role: 'Squad Leader', risk: 'HIGH' },
  ];

  // API Call Simulator
  const handleApiSimulate = async () => {
    setApiLoading(true);
    setApiData(null);
    try {
      // Simulate fetch payload
      const data = await mockResolve([
        { id: 'S-01', user: 'Demo Personnel X', status: 'Optimal', activeDays: 28 },
        { id: 'S-02', user: 'Demo Personnel Y', status: 'Fatigued', activeDays: 14 },
      ]);
      setApiData(data);
      toast.success('Simulated API data loaded successfully.');
    } catch (e: any) {
      toast.error('Simulated API request failed.');
    } finally {
      setApiLoading(false);
    }
  };

  return (
    <div className="space-y-10 pb-20">
      <SectionHeader
        title="Component Showcase"
        description="Developer QA laboratory displaying all foundation UI building blocks and design tokens."
        actions={
          <div className="flex items-center gap-2">
            <Button variant="danger" size="sm" onClick={() => setShouldCrash(true)}>
              Test Error Boundary
            </Button>
          </div>
        }
      />

      {/* Crashy component test hidden hook */}
      <CrashyComponent shouldCrash={shouldCrash} />

      {/* 1. Stat Cards / KPI Grid */}
      <div className="space-y-4">
        <h3 className="text-sm font-extrabold text-textPrimary border-b border-border pb-1.5 uppercase tracking-wide">
          1. KPI Stats & Badges
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatCard title="Active Personnel" value="1,240" trend={{ value: '+4.2%', direction: 'up', label: 'this week' }} />
          <StatCard title="Active Welfare Cases" value="14" trend={{ value: '-8%', direction: 'down', label: 'this month' }} />
          <StatCard title="Critical System Alerts" value="2" riskLevel="HIGH" />
          <StatCard title="Average Stress Index" value="6.4 / 10" riskLevel="MODERATE" />
        </div>
        <div className="flex flex-wrap gap-2 pt-2 items-center">
          <span className="text-xs text-textMuted select-none">Risk States:</span>
          <RiskBadge level="LOW" />
          <RiskBadge level="MODERATE" />
          <RiskBadge level="ELEVATED" />
          <RiskBadge level="HIGH" />
          <span className="text-xs text-textMuted ml-4 select-none">General Badges:</span>
          <Badge variant="primary">Primary</Badge>
          <Badge variant="success">Success</Badge>
          <Badge variant="warning">Warning</Badge>
          <Badge variant="danger">Danger</Badge>
          <Badge variant="info">Info</Badge>
        </div>
      </div>

      {/* 2. Interactive Shell Elements */}
      <div className="space-y-4">
        <h3 className="text-sm font-extrabold text-textPrimary border-b border-border pb-1.5 uppercase tracking-wide">
          2. Overlay Actions & Notifications
        </h3>
        <div className="flex flex-wrap gap-3 items-center">
          <Button variant="primary" onClick={() => setIsModalOpen(true)}>
            Open Test Modal
          </Button>
          <Button variant="secondary" onClick={() => setIsDrawerOpen(true)}>
            Open Navigation Drawer
          </Button>
          <Button variant="tertiary" onClick={() => toast.success('Action accomplished successfully!', 'Success Notification')}>
            Toast Success
          </Button>
          <Button variant="danger" onClick={() => toast.error('API connection failed. Please try again.', 'Connection Error')}>
            Toast Error
          </Button>
          <Button variant="ghost" onClick={() => toast.warning('Workload limits reached for sector 4.', 'Welfare Advisory')}>
            Toast Warning
          </Button>

          <Tooltip content="This is a hover tooltip">
            <Button variant="secondary" size="sm">Hover for Tooltip</Button>
          </Tooltip>
          
          <Popover trigger={<Button variant="secondary" size="sm">Click for Popover</Button>} placement="bottom-start">
            <div className="space-y-1">
              <h5 className="font-bold text-xs text-textPrimary">Popover Title</h5>
              <p className="text-[10px] text-textMuted">This is a floating context popover container bubble.</p>
            </div>
          </Popover>
        </div>
      </div>

      {/* 3. Form Inputs Grid */}
      <div className="space-y-4">
        <h3 className="text-sm font-extrabold text-textPrimary border-b border-border pb-1.5 uppercase tracking-wide">
          3. Form Fields & Interactive Inputs
        </h3>
        <Panel title="Form Layout Sandbox">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Input
              label="Personnel Name Address"
              placeholder="e.g. John Doe"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              helperText="Enter full registered surname."
            />
            <Select
              label="Access Tier Level"
              value={selectVal}
              onChange={(e) => setSelectVal(e.target.value)}
              options={[
                { label: 'Tier 1 - Standard Personnel', value: '1' },
                { label: 'Tier 2 - Welfare Officer', value: '2' },
                { label: 'Tier 3 - Commanding Officer', value: '3' },
              ]}
            />
            <Slider
              label="Simulation Stress Rating Scale"
              min={1}
              max={10}
              step={1}
              value={sliderVal}
              onChangeValue={setSliderVal}
            />
            <RadioGroup
              label="Selected Sector Area"
              name="sectors"
              selectedValue={radioVal}
              onChange={setRadioVal}
              options={[
                { label: 'Sector North Alpha', value: 'opt1' },
                { label: 'Sector South Delta', value: 'opt2' },
              ]}
            />
            <div className="flex flex-col gap-4 justify-center">
              <Checkbox
                label="Authorize aggregated report sharing"
                checked={checkboxVal}
                onChange={(e) => setCheckboxVal(e.target.checked)}
              />
              <Toggle
                label="System Diagnostic Mode"
                checked={toggleVal}
                onChange={setToggleVal}
              />
            </div>
            <TextArea
              label="Additional Case Narrative"
              placeholder="Provide context..."
              rows={2}
            />
          </div>
        </Panel>
      </div>

      {/* 4. Table Components */}
      <div className="space-y-4">
        <h3 className="text-sm font-extrabold text-textPrimary border-b border-border pb-1.5 uppercase tracking-wide">
          4. Responsive Table Views
        </h3>
        <Table columns={columns} data={tableData} />
      </div>

      {/* 5. Tabs and Skeletons */}
      <div className="space-y-4">
        <h3 className="text-sm font-extrabold text-textPrimary border-b border-border pb-1.5 uppercase tracking-wide">
          5. Tabs, Skeletons, and Empty States
        </h3>
        <div className="space-y-4">
          <Tabs
            tabs={[
              { id: 'tab1', label: 'Operational Overview', count: 12 },
              { id: 'tab2', label: 'Historical Records' },
              { id: 'tab3', label: 'Pending Welfare Audits', count: 0 },
            ]}
            activeTabId={activeTab}
            onChangeTab={setActiveTab}
          />
          {activeTab === 'tab1' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Skeleton variant="card" />
              <Skeleton variant="card" />
              <Skeleton variant="card" />
            </div>
          )}
          {activeTab === 'tab2' && (
            <EmptyState
              title="No Historical Records Found"
              description="This segment has no aggregate records stored. Check back after future check-ins are logged."
            />
          )}
          {activeTab === 'tab3' && (
            <ErrorState
              title="Data Load Failed"
              description="There was a connection interruption loading pending audits."
              onRetry={() => toast.info('Re-attempting pending audits load...')}
            />
          )}
        </div>
      </div>

      {/* 6. API Latency & Mock resolver demonstration */}
      <div className="space-y-4">
        <h3 className="text-sm font-extrabold text-textPrimary border-b border-border pb-1.5 uppercase tracking-wide">
          6. API Client + Mock Resolution Flow
        </h3>
        <Card className="space-y-4">
          <div className="flex justify-between items-center flex-wrap gap-2">
            <div>
              <h4 className="font-bold text-textPrimary">Simulate apiClient request</h4>
              <p className="text-xs text-textMuted mt-0.5">
                Uses the mockAdapter resolver to inject artificial delay, executing full skeleton states.
              </p>
            </div>
            <Button onClick={handleApiSimulate} isLoading={apiLoading}>
              Trigger API request
            </Button>
          </div>

          {/* Loader skeleton fallback */}
          {apiLoading && (
            <div className="space-y-2">
              <Skeleton variant="line" className="w-1/4 h-4" />
              <Skeleton variant="line" className="w-full h-8" />
            </div>
          )}

          {/* Result view */}
          {apiData && (
            <div className="p-3 bg-surfaceAlt border border-border rounded-md text-xs font-mono overflow-x-auto">
              <p className="font-semibold mb-1 text-textPrimary">// Simulated JSON Response:</p>
              {JSON.stringify(apiData, null, 2)}
            </div>
          )}
        </Card>
      </div>

      {/* Interactive overlays */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Developer System Audit">
        <p className="mb-4">
          This modal demonstrates our accessible overlay dialog. Focus is trapped inside this modal and can be navigatd via keyboard.
        </p>
        <div className="space-y-3">
          <Input label="Sub-task Input Label" placeholder="Insert details here..." />
          <Checkbox label="Acknowledge audit checks" />
        </div>
      </Modal>

      <Drawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} title="System Navigation Panel" placement="right">
        <p className="mb-4 text-xs text-textSecondary leading-relaxed">
          This drawer slides in from the right edge, matching our responsive mobile drawer architectures.
        </p>
        <ul className="space-y-2">
          <li>
            <Button variant="secondary" className="w-full justify-start text-xs font-semibold" onClick={() => setIsDrawerOpen(false)}>
              Back to Main Screen
            </Button>
          </li>
        </ul>
      </Drawer>
    </div>
  );
};
export default ComponentShowcasePage;
