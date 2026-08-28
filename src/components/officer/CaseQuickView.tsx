import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Drawer from '../ui/Drawer';
import Button from '../ui/Button';
import RiskLevelBadge from './RiskLevelBadge';
import RiskTrendIndicator from './RiskTrendIndicator';
import CaseStatusBadge from './CaseStatusBadge';
import Tooltip from '../ui/Tooltip';
import type { WelfareCase } from '@/services/caseService';
import caseService from '@/services/caseService';

interface Props {
  caseItem: WelfareCase | null;
  onClose: () => void;
  onUpdate: () => void;
}

export const CaseQuickView: React.FC<Props> = ({ caseItem, onClose, onUpdate }) => {
  const navigate = useNavigate();
  const [isAcknowledgeLoading, setIsAcknowledgeLoading] = useState(false);
  const [isFollowUpLoading, setIsFollowUpLoading] = useState(false);
  
  // Follow-up Form states (FR-30)
  const [showFollowUpForm, setShowFollowUpForm] = useState(false);
  const [followUpType, setFollowUpType] = useState('WELFARE_CONVERSATION');
  const [scheduledFor, setScheduledFor] = useState('');
  const [notes, setNotes] = useState('');

  if (!caseItem) return null;

  const handleAcknowledge = async () => {
    setIsAcknowledgeLoading(true);
    try {
      await caseService.acknowledgeCase(caseItem.id);
      onUpdate();
    } catch {
      // Ignore for mock
    } finally {
      setIsAcknowledgeLoading(false);
    }
  };

  const handleSaveFollowUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsFollowUpLoading(true);
    try {
      await caseService.createFollowUp(caseItem.id, {
        type: followUpType,
        scheduledFor,
        notes: notes.trim() || undefined,
      });
      setShowFollowUpForm(false);
      onUpdate();
    } catch {
      // Ignore for mock
    } finally {
      setIsFollowUpLoading(false);
    }
  };

  return (
    <Drawer
      isOpen={!!caseItem}
      onClose={onClose}
      title={`Reviewing Case — ${caseItem.personnelDisplayId}`}
      placement="right"
      className="max-w-[400px] w-full"
    >
      <div className="space-y-6 select-none text-left font-sans">
        {/* Status Highlights (FR-19) */}
        <div className="border border-border rounded-md p-4 bg-surfaceAlt/10 space-y-3">
          <div className="flex justify-between items-center text-xs">
            <span className="font-semibold text-textSecondary">Case Status</span>
            <CaseStatusBadge status={caseItem.status} />
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="font-semibold text-textSecondary">Risk Level</span>
            <RiskLevelBadge level={caseItem.riskLevel} />
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="font-semibold text-textSecondary">Trend</span>
            <RiskTrendIndicator trend={caseItem.trend} />
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="font-semibold text-textSecondary">Confidence</span>
            {caseItem.confidence ? (
              <div className="flex items-center gap-1">
                <span className="font-bold text-textPrimary">{caseItem.confidence}%</span>
                <Tooltip content="Confidence indicates how strongly available signals support this welfare-risk flags. It is not a measure of medical certainty.">
                  <span className="text-textMuted cursor-help text-[10px]">ⓘ</span>
                </Tooltip>
              </div>
            ) : (
              <span className="text-textMuted">—</span>
            )}
          </div>
        </div>

        {/* Contributing Factors (FR-21) */}
        {caseItem.primaryFactors.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-textMuted uppercase tracking-wider">
              Highlighted Signals
            </h4>
            <div className="space-y-1.5">
              {caseItem.primaryFactors.map((f, idx) => (
                <div key={idx} className="border-l-2 border-primary pl-2 text-xs py-0.5">
                  <span className="font-bold text-textPrimary">{f.label}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* AI Assisted Disclaimer (FR-37, FR-64) */}
        <div className="bg-primary/5 border border-primary/10 rounded-md p-3.5 text-[11px] text-textSecondary leading-relaxed space-y-1 select-none">
          <h5 className="font-bold text-primary uppercase tracking-wide text-[9px]">
            AI-Assisted Assessment
          </h5>
          <p>
            This overview is based on available duties and voluntary self-report indicators. It is designed to assist welfare officers in identifying workload fatigue patterns.
          </p>
          <p className="font-bold text-textPrimary">
            It is not a medical diagnosis. A human officer makes all decisions.
          </p>
        </div>

        {/* Actions Menu */}
        <div className="space-y-2 pt-2 border-t border-border">
          {caseItem.status === 'REVIEW_REQUIRED' && (
            <Button
              variant="primary"
              size="sm"
              className="w-full font-bold"
              onClick={handleAcknowledge}
              isLoading={isAcknowledgeLoading}
            >
              Acknowledge Case
            </Button>
          )}

          {!showFollowUpForm && (
            <Button
              variant="secondary"
              size="sm"
              className="w-full font-bold"
              onClick={() => setShowFollowUpForm(true)}
            >
              Schedule Follow-Up
            </Button>
          )}

          <Button
            variant="ghost"
            size="sm"
            className="w-full text-xs font-bold text-primary hover:bg-primary/5 border border-primary/20"
            onClick={() => navigate(`/officer/cases/${caseItem.id}`)}
          >
            View Full Risk Profile
          </Button>
        </div>

        {/* Follow-Up Scheduler Form (FR-30, FR-48) */}
        {showFollowUpForm && (
          <form onSubmit={handleSaveFollowUp} className="border border-border/80 rounded-md p-4 bg-surface space-y-4 animate-fadeIn">
            <h4 className="text-xs font-bold text-textPrimary uppercase tracking-wide border-b border-border pb-1.5">
              Schedule Action Follow-Up
            </h4>
            
            <div className="space-y-1 text-xs">
              <label className="font-semibold text-textSecondary block">Follow-Up Type</label>
              <select
                value={followUpType}
                onChange={(e) => setFollowUpType(e.target.value)}
                className="w-full p-2 border border-border rounded bg-surface text-textPrimary text-xs focus:outline-none"
              >
                <option value="WELFARE_CONVERSATION">Welfare Conversation</option>
                <option value="SUPPORT_RESOURCES">Explore Support Resources</option>
                <option value="WORKLOAD_REVIEW">Review Active Duty Workloads</option>
                <option value="GENERAL_CHECK_IN">General Check-In Session</option>
              </select>
            </div>

            <div className="space-y-1 text-xs font-sans">
              <label className="font-semibold text-textSecondary block">Target Date</label>
              <input
                type="date"
                required
                value={scheduledFor}
                onChange={(e) => setScheduledFor(e.target.value)}
                className="w-full p-2 border border-border rounded bg-surface text-textPrimary text-xs focus:outline-none"
              />
            </div>

            <div className="space-y-1 text-xs font-sans">
              <label className="font-semibold text-textSecondary block">Confidential Notes (Optional)</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Private evaluation notes for reference..."
                className="w-full p-2 border border-border rounded bg-surface text-textPrimary text-xs focus:outline-none h-16 resize-none"
              />
            </div>

            <div className="flex gap-2 justify-end">
              <button
                type="button"
                onClick={() => setShowFollowUpForm(false)}
                disabled={isFollowUpLoading}
                className="px-2.5 py-1.5 border border-border hover:bg-surfaceAlt text-textSecondary rounded text-xs font-semibold focus:outline-none"
              >
                Cancel
              </button>
              <Button
                type="submit"
                variant="primary"
                size="sm"
                className="font-bold"
                isLoading={isFollowUpLoading}
              >
                Save
              </Button>
            </div>
          </form>
        )}
      </div>
    </Drawer>
  );
};
export default CaseQuickView;
