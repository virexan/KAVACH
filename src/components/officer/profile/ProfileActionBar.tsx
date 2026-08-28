import React, { useState } from 'react';
import Button from '../../ui/Button';

interface Props {
  status: string;
  onAcknowledge: () => Promise<void>;
  onMarkMonitoring: () => Promise<void>;
  onScheduleFollowUp: () => void;
}

export const ProfileActionBar: React.FC<Props> = ({
  status,
  onAcknowledge,
  onMarkMonitoring,
  onScheduleFollowUp
}) => {
  const [isAckLoading, setIsAckLoading] = useState(false);
  const [isMonLoading, setIsMonLoading] = useState(false);

  const handleAck = async () => {
    setIsAckLoading(true);
    try {
      await onAcknowledge();
    } finally {
      setIsAckLoading(false);
    }
  };

  const handleMon = async () => {
    setIsMonLoading(true);
    try {
      await onMarkMonitoring();
    } finally {
      setIsMonLoading(false);
    }
  };

  return (
    <div className="flex flex-wrap gap-3 p-4 bg-surface border border-border rounded-lg justify-start items-center select-none font-sans animate-fadeIn">
      {status === 'REVIEW_REQUIRED' && (
        <Button variant="primary" size="sm" onClick={handleAck} isLoading={isAckLoading} className="font-bold">
          Acknowledge Case (FR-29)
        </Button>
      )}

      <Button variant="secondary" size="sm" onClick={onScheduleFollowUp} className="font-bold">
        Schedule Follow-Up (FR-30)
      </Button>

      {status !== 'MONITORING' && (
        <Button variant="ghost" size="sm" onClick={handleMon} isLoading={isMonLoading} className="font-bold text-textSecondary hover:bg-surfaceAlt border border-border/80">
          Mark Active Monitoring
        </Button>
      )}
    </div>
  );
};
export default ProfileActionBar;
