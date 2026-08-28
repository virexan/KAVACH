import React from 'react';
import Card from '../../ui/Card';
import Tooltip from '../../ui/Tooltip';
import type { PersonalRisk } from '@/services/caseService';

interface Props {
  risk: PersonalRisk;
}

export const CurrentRiskCard: React.FC<Props> = ({ risk }) => {
  const getStyles = (level: string) => {
    switch (level) {
      case 'LOW':
        return {
          bg: 'bg-primary/5 border-primary/20',
          text: 'text-primary',
          desc: 'No significant welfare-risk signals currently identified.'
        };
      case 'MODERATE':
        return {
          bg: 'bg-warning/5 border-warning/20',
          text: 'text-warning',
          desc: 'Some signals suggest that continued monitoring may be useful.'
        };
      case 'ELEVATED':
        return {
          bg: 'bg-orange-500/5 border-orange-500/20',
          text: 'text-orange-600',
          desc: 'Multiple signals suggest that additional welfare review may be useful.'
        };
      case 'HIGH':
        return {
          bg: 'bg-danger/5 border-danger/20',
          text: 'text-danger',
          desc: 'Several significant signals have been identified and should receive timely human review.'
        };
      default:
        return {
          bg: 'bg-surfaceAlt/40 border-border',
          text: 'text-textSecondary',
          desc: 'There is not enough recent information to establish a reliable risk assessment.'
        };
    }
  };

  const styles = getStyles(risk.level);

  return (
    <Card className={`p-5 flex flex-col justify-between h-full select-none ${styles.bg} font-sans`}>
      <div className="space-y-2 text-left">
        <h4 className="text-xs font-semibold text-textMuted uppercase tracking-wider">
          Current Welfare Risk
        </h4>
        <span className={`text-3xl font-black block tracking-tight ${styles.text}`}>
          {risk.level.replace('_', ' ')}
        </span>
        <p className="text-xs text-textSecondary leading-relaxed pt-1.5 font-medium">
          {styles.desc}
        </p>
      </div>

      {risk.confidence ? (
        <div className="pt-4 border-t border-border/40 flex justify-between items-center text-xs select-none">
          <span className="font-semibold text-textSecondary">Confidence Index</span>
          <div className="flex items-center gap-1 font-bold text-textPrimary">
            <span>{risk.confidence}%</span>
            <Tooltip content="Confidence reflects how strongly available signals support this welfare-risk assessment. It is not a measure of medical certainty.">
              <span className="text-textMuted cursor-help text-[10px]">ⓘ</span>
            </Tooltip>
          </div>
        </div>
      ) : (
        <div className="pt-4 border-t border-border/40 flex justify-between items-center text-xs select-none text-textMuted">
          <span>Confidence Index</span>
          <span>Not available</span>
        </div>
      )}
    </Card>
  );
};
export default CurrentRiskCard;
