import React, { useState } from 'react';
import Drawer from '../../ui/Drawer';
import Button from '../../ui/Button';
import RecommendationStatusBadge from './RecommendationStatusBadge';
import RecommendationPriorityBadge from './RecommendationPriorityBadge';
import RecommendationRationale from './RecommendationRationale';
import type { Recommendation } from '@/services/recommendationService';
import recommendationService from '@/services/recommendationService';

interface Props {
  recommendation: Recommendation | null;
  onClose: () => void;
  onUpdate: () => void;
  onCreateFollowUp: (rec: Recommendation) => void;
}

export const RecommendationDetail: React.FC<Props> = ({
  recommendation,
  onClose,
  onUpdate,
  onCreateFollowUp,
}) => {
  const [isAcceptLoading, setIsAcceptLoading] = useState(false);
  const [isDismissLoading, setIsDismissLoading] = useState(false);

  const [showDismissForm, setShowDismissForm] = useState(false);
  const [dismissReason, setDismissReason] = useState('NOT_APPROPRIATE');
  const [notes, setNotes] = useState('');

  if (!recommendation) return null;

  const handleAccept = async () => {
    setIsAcceptLoading(true);
    try {
      await recommendationService.acceptRecommendation(recommendation.id);
      onUpdate();
    } catch {
      // Ignore
    } finally {
      setIsAcceptLoading(false);
    }
  };

  const handleDismiss = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsDismissLoading(true);
    try {
      await recommendationService.dismissRecommendation(recommendation.id, dismissReason, notes.trim() || undefined);
      setShowDismissForm(false);
      onUpdate();
    } catch {
      // Ignore
    } finally {
      setIsDismissLoading(false);
    }
  };

  return (
    <Drawer
      isOpen={!!recommendation}
      onClose={onClose}
      title="Recommendation Context"
      placement="right"
      className="max-w-[420px] w-full"
    >
      <div className="space-y-6 select-none text-left font-sans">
        {/* Badges Summary */}
        <div className="border border-border rounded-md p-4 bg-surfaceAlt/10 space-y-3">
          <div className="flex justify-between items-center text-xs">
            <span className="font-semibold text-textSecondary">Priority Level</span>
            <RecommendationPriorityBadge priority={recommendation.priority} />
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="font-semibold text-textSecondary">Approval Status</span>
            <RecommendationStatusBadge status={recommendation.status} />
          </div>
        </div>

        {/* Card Title */}
        <div className="space-y-1">
          <h3 className="text-base font-bold text-textPrimary leading-tight">{recommendation.title}</h3>
          <span className="text-[10px] text-textMuted font-bold block uppercase tracking-wider">
            Target Case: {recommendation.personnelDisplayId}
          </span>
        </div>

        {/* Description */}
        <p className="text-xs text-textSecondary leading-relaxed">{recommendation.description}</p>

        {/* Rationale Triggers */}
        <RecommendationRationale recommendation={recommendation} />

        {/* Action Controls */}
        {recommendation.status === 'NEW' && !showDismissForm && (
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border">
            <Button
              variant="primary"
              size="sm"
              className="font-bold"
              onClick={handleAccept}
              isLoading={isAcceptLoading}
            >
              Accept
            </Button>
            <Button
              variant="secondary"
              size="sm"
              className="font-bold"
              onClick={() => setShowDismissForm(true)}
            >
              Dismiss
            </Button>
          </div>
        )}

        {/* Accepted State controls */}
        {recommendation.status === 'ACCEPTED' && (
          <div className="pt-2 border-t border-border space-y-2">
            <Button
              variant="primary"
              size="sm"
              className="w-full font-bold"
              onClick={() => onCreateFollowUp(recommendation)}
            >
              Schedule Follow-Up
            </Button>
            <p className="text-[10px] text-textMuted text-center font-semibold">
              Accepted for consideration. Schedule actions above.
            </p>
          </div>
        )}

        {/* Dismissal Reason Form (FR-19) */}
        {showDismissForm && (
          <form onSubmit={handleDismiss} className="border border-border rounded-md p-4 bg-surface space-y-4 animate-fadeIn">
            <h4 className="text-xs font-bold text-textPrimary uppercase tracking-wide border-b border-border pb-1.5">
              Reason for Dismissal
            </h4>

            <div className="space-y-2 text-xs font-semibold text-textSecondary">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="dismissReason"
                  value="NOT_APPROPRIATE"
                  checked={dismissReason === 'NOT_APPROPRIATE'}
                  onChange={() => setDismissReason('NOT_APPROPRIATE')}
                  className="text-primary focus:ring-primary"
                />
                Not appropriate in current context
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="dismissReason"
                  value="ALREADY_ADDRESSED"
                  checked={dismissReason === 'ALREADY_ADDRESSED'}
                  onChange={() => setDismissReason('ALREADY_ADDRESSED')}
                  className="text-primary focus:ring-primary"
                />
                Already addressed
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="dismissReason"
                  value="INSUFFICIENT_INFORMATION"
                  checked={dismissReason === 'INSUFFICIENT_INFORMATION'}
                  onChange={() => setDismissReason('INSUFFICIENT_INFORMATION')}
                  className="text-primary focus:ring-primary"
                />
                Insufficient information
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="dismissReason"
                  value="OTHER"
                  checked={dismissReason === 'OTHER'}
                  onChange={() => setDismissReason('OTHER')}
                  className="text-primary focus:ring-primary"
                />
                Other
              </label>
            </div>

            <div className="space-y-1 text-xs">
              <label className="font-semibold text-textSecondary block">Additional Notes (Optional)</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Reason details..."
                className="w-full p-2 border border-border rounded bg-surface text-textPrimary text-xs focus:outline-none h-16 resize-none font-sans"
              />
            </div>

            <div className="flex gap-2 justify-end">
              <button
                type="button"
                onClick={() => setShowDismissForm(false)}
                disabled={isDismissLoading}
                className="px-2.5 py-1.5 border border-border hover:bg-surfaceAlt text-textSecondary rounded text-xs font-semibold focus:outline-none font-sans"
              >
                Cancel
              </button>
              <Button
                type="submit"
                variant="primary"
                size="sm"
                className="font-bold"
                isLoading={isDismissLoading}
              >
                Confirm Dismissal
              </Button>
            </div>
          </form>
        )}
      </div>
    </Drawer>
  );
};
export default RecommendationDetail;
