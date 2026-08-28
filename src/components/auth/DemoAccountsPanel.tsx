import React, { useState } from 'react';
import Button from '@/components/ui/Button';
import { MOCK_USERS } from '@/services/authService';

interface DemoAccountsPanelProps {
  onSelectUser: (serviceId: string) => void;
}

export const DemoAccountsPanel: React.FC<DemoAccountsPanelProps> = ({ onSelectUser }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-border rounded-lg bg-surfaceAlt/20 p-4 select-none">
      <div className="flex justify-between items-center">
        <h3 className="text-xs font-bold text-textSecondary uppercase tracking-wider">
          Demo Accounts / Sandbox
        </h3>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-xs font-bold text-primary hover:underline focus:outline-none"
          aria-expanded={isOpen}
        >
          {isOpen ? 'Hide accounts' : 'Show accounts'}
        </button>
      </div>

      {isOpen && (
        <div className="mt-3 space-y-3">
          <p className="text-xs text-textMuted leading-relaxed">
            Select an identity to auto-populate credentials. Password is <strong>demo1234</strong>.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {MOCK_USERS.map((u) => (
              <Button
                key={u.id}
                variant="secondary"
                size="sm"
                className="justify-start text-xs text-left"
                aria-label={`Autofill Demo ${u.displayName} account`}
                onClick={() => onSelectUser(u.serviceId)}
              >
                <div className="flex flex-col items-start leading-tight">
                  <span className="font-semibold text-textPrimary">{u.displayName}</span>
                  <span className="text-[10px] text-textMuted">
                    ID: {u.serviceId} ({u.role})
                  </span>
                </div>
              </Button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
export default DemoAccountsPanel;
