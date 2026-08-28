import React from 'react';
import { useUIStore } from '@/store/uiStore';
import { apiClient } from '@/lib/apiClient';

export const DemoDataBanner: React.FC = () => {
  const { demoBannerDismissed, dismissDemoBanner } = useUIStore();
  const isMockActive = apiClient.useMocks();

  if (!isMockActive || demoBannerDismissed) return null;

  return (
    <div className="bg-info/10 border-b border-info/20 text-info px-4 py-2 text-xs flex justify-between items-center select-none font-medium">
      <div className="flex items-center gap-2">
        <span className="inline-block w-2 h-2 rounded-full bg-info animate-pulse" />
        <span>
          <strong>Synthetic Demo Environment:</strong> You are viewing simulated personnel and officer records. No real personal information is stored or transmitted.
        </span>
      </div>
      <button
        onClick={dismissDemoBanner}
        className="hover:bg-info/20 p-1 rounded transition-colors text-info/80 hover:text-info focus:outline-none"
        aria-label="Dismiss warning banner"
      >
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
};
export default DemoDataBanner;
