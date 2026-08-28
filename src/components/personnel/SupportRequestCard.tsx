import React, { useState } from 'react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { resourceService } from '@/services/resourceService';

export const SupportRequestCard: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [ticketId, setTicketId] = useState<string | null>(null);

  const handleRequest = async () => {
    setIsLoading(true);
    try {
      const response = await resourceService.requestSupport();
      setTicketId(response.data.ticketId);
    } catch {
      // Ignore in mock setup
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="bg-surface border border-primary/20 bg-primary/5 p-6 space-y-4">
      <div className="space-y-1.5 select-none">
        <h3 className="font-bold text-textPrimary text-base">Want to talk to someone?</h3>
        <p className="text-sm text-textSecondary leading-relaxed">
          You can request a voluntary welfare check-in session. A Welfare Officer will schedule a confidential callback with you to assist with workload stress.
        </p>
      </div>

      {ticketId ? (
        <div className="bg-success/10 border border-success/20 text-success text-xs font-semibold p-4 rounded-md space-y-1 select-none animate-fadeIn">
          <p className="font-bold">Check-In Callback Requested ✓</p>
          <p>Confidential check-in scheduled. Reference ID: <strong>{ticketId}</strong>.</p>
          <p className="text-[10px] text-success/80 font-normal">
            Note: This is a sandbox demonstration callback request.
          </p>
        </div>
      ) : (
        <div className="pt-2">
          <Button
            variant="primary"
            size="sm"
            className="w-full sm:w-auto font-bold"
            onClick={handleRequest}
            isLoading={isLoading}
          >
            Request Check-In Callback
          </Button>
        </div>
      )}
    </Card>
  );
};
export default SupportRequestCard;
