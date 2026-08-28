import React from 'react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import type { ModelVersion } from '@/services/adminService';

interface Props {
  model: ModelVersion;
  onActivate: (model: ModelVersion) => void;
}

export const ModelVersionCard: React.FC<Props> = ({ model, onActivate }) => {
  const getStatusStyle = (st: string) => {
    switch (st) {
      case 'ACTIVE':
        return 'bg-success/10 text-success border-success/20';
      case 'DRAFT':
        return 'bg-warning/10 text-warning border-warning/20';
      default:
        return 'bg-surfaceAlt text-textSecondary border-border';
    }
  };

  return (
    <Card className="bg-surface p-5 border border-border select-none text-left font-sans space-y-4 animate-fadeIn">
      <div className="flex justify-between items-start gap-4">
        <div className="space-y-1">
          <span className="text-[10px] text-textMuted font-bold uppercase tracking-wider block">
            Engine Version Model
          </span>
          <h4 className="font-bold text-textPrimary text-base leading-tight select-none">
            {model.name} <span className="text-textSecondary text-xs">({model.version})</span>
          </h4>
        </div>
        <span className={`px-2 py-0.5 border rounded text-[9px] font-bold uppercase tracking-wider ${getStatusStyle(model.status)}`}>
          {model.status}
        </span>
      </div>

      <div className="border border-border/80 rounded bg-surfaceAlt/20 p-3 space-y-2 text-xs">
        <div>
          <span className="text-[8px] font-bold text-textMuted uppercase block">Model Inputs Schema (FR-41)</span>
          <span className="text-textSecondary font-medium">Organizational rosters, Daily check-ins, Wearables data</span>
        </div>
        <div>
          <span className="text-[8px] font-bold text-textMuted uppercase block">Model Output Boundaries (FR-41)</span>
          <span className="text-textSecondary font-medium">Categorical Welfare risk level, fatigue trajectory, contributor weights</span>
        </div>
      </div>

      <div className="pt-2 border-t border-border/40 flex justify-between items-center text-[10px] text-textMuted font-bold uppercase font-sans">
        <span>Created: {new Date(model.createdAt).toLocaleDateString()}</span>
        {model.status === 'DRAFT' && (
          <Button variant="primary" size="sm" onClick={() => onActivate(model)} className="font-bold">
            Activate Version
          </Button>
        )}
      </div>
    </Card>
  );
};
export default ModelVersionCard;
