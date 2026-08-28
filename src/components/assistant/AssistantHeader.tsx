import React from 'react';

export const AssistantHeader: React.FC = () => {
  return (
    <div className="border-b border-border pb-4 select-none font-sans text-left animate-fadeIn">
      <h1 className="text-2xl font-black text-textPrimary leading-tight">Welfare AI Assistant</h1>
      <p className="text-xs text-textMuted mt-0.5">
        Ask questions about welfare trends, workload, policies, and support options.
      </p>
      <div className="mt-2 inline-flex items-center gap-1.5 text-[10px] font-bold text-primary bg-primary/10 border border-primary/20 px-2 py-0.5 rounded uppercase tracking-wider">
        <span>✦</span> AI-Assisted • Evidence Grounded
      </div>
    </div>
  );
};
export default AssistantHeader;
