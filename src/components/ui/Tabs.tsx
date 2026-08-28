import React from 'react';

export interface TabOption {
  id: string;
  label: string;
  count?: number;
}

export interface TabsProps {
  tabs: TabOption[];
  activeTabId: string;
  onChangeTab: (id: string) => void;
  className?: string;
}

export const Tabs: React.FC<TabsProps> = ({ tabs, activeTabId, onChangeTab, className = '' }) => {
  return (
    <div className={`border-b border-border w-full overflow-x-auto ${className}`}>
      <nav className="flex gap-6 -mb-px" aria-label="Tabs">
        {tabs.map((tab) => {
          const isActive = tab.id === activeTabId;
          return (
            <button
              key={tab.id}
              onClick={() => onChangeTab(tab.id)}
              className={`pb-4 px-1 text-sm font-semibold border-b-2 whitespace-nowrap transition-colors flex items-center gap-2 select-none ${
                isActive
                  ? 'border-primary text-primary'
                  : 'border-transparent text-textMuted hover:text-textSecondary hover:border-border'
              }`}
              aria-current={isActive ? 'page' : undefined}
            >
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                  isActive ? 'bg-primary/10 text-primary' : 'bg-surfaceAlt text-textSecondary'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
};
export default Tabs;
