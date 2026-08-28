import React, { useState } from 'react';
import Modal from '../../ui/Modal';
import Button from '../../ui/Button';
import type { OutcomeType } from '@/services/interventionService';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { outcome: OutcomeType; notes?: string; nextReviewDate?: string }) => Promise<void>;
}

export const OutcomeForm: React.FC<Props> = ({ isOpen, onClose, onSubmit }) => {
  const [outcome, setOutcome] = useState<OutcomeType>('NO_FURTHER_ACTION');
  const [notes, setNotes] = useState('');
  const [nextReviewDate, setNextReviewDate] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await onSubmit({
        outcome,
        notes: notes.trim() || undefined,
        nextReviewDate: nextReviewDate || undefined,
      });
      onClose();
    } catch {
      // Ignore
    } finally {
      setIsLoading(false);
    }
  };

  const showReviewDate = outcome === 'CONTINUE_MONITORING' || outcome === 'ADDITIONAL_FOLLOW_UP';

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Complete Welfare Follow-Up" className="max-w-md w-full select-none text-left">
      <form onSubmit={handleSubmit} className="space-y-4 font-sans text-left">
        
        <div className="space-y-1 text-xs">
          <label className="font-semibold text-textSecondary block">Select Outcome (FR-33)</label>
          <select
            value={outcome}
            onChange={(e) => setOutcome(e.target.value as OutcomeType)}
            className="w-full p-2.5 border border-border rounded bg-surface text-textPrimary text-xs focus:outline-none"
          >
            <option value="NO_FURTHER_ACTION">No further action required</option>
            <option value="CONTINUE_MONITORING">Continue monitoring situation</option>
            <option value="ADDITIONAL_FOLLOW_UP">Additional follow-up session needed</option>
            <option value="ADDITIONAL_SUPPORT">Additional external support recommended</option>
          </select>
        </div>

        {showReviewDate && (
          <div className="space-y-1 text-xs animate-fadeIn">
            <label className="font-semibold text-textSecondary block">Next Review Date</label>
            <input
              type="date"
              required
              value={nextReviewDate}
              onChange={(e) => setNextReviewDate(e.target.value)}
              className="w-full p-2.5 border border-border rounded bg-surface text-textPrimary text-xs focus:outline-none"
            />
          </div>
        )}

        <div className="space-y-1 text-xs font-sans">
          <label className="font-semibold text-textSecondary block">Confidential Case Notes (Optional)</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Private outcome summary and context updates..."
            className="w-full p-2.5 border border-border rounded bg-surface text-textPrimary text-xs focus:outline-none h-20 resize-none"
          />
        </div>

        <div className="flex gap-2 justify-end pt-2 border-t border-border mt-4">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="px-3.5 py-2 border border-border hover:bg-surfaceAlt text-textSecondary rounded text-xs font-semibold focus:outline-none font-sans"
          >
            Cancel
          </button>
          <Button
            type="submit"
            variant="primary"
            size="sm"
            className="font-bold"
            isLoading={isLoading}
          >
            Complete Follow-Up
          </Button>
        </div>
      </form>
    </Modal>
  );
};
export default OutcomeForm;
