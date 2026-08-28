import React from 'react';
import type { WelfareCaseProfile } from '@/services/caseService';
import ProfileStatusBadge from './ProfileStatusBadge';

interface Props {
  profile: WelfareCaseProfile;
  onBack: () => void;
}

export const ProfileHeader: React.FC<Props> = ({ profile, onBack }) => {
  const p = profile.personnel;
  
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 select-none border-b border-border pb-4 mb-6 font-sans">
      <div className="space-y-1.5 text-left">
        <button
          onClick={onBack}
          className="text-xs font-bold text-textMuted hover:text-primary transition-colors flex items-center gap-1.5 focus:outline-none mb-1"
        >
          ← Back to Cases
        </button>
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-black text-textPrimary leading-tight">
            Personnel {p.displayId}
          </h1>
          <ProfileStatusBadge status={profile.status} />
        </div>
        <p className="text-xs text-textSecondary font-medium">
          Unit: <strong className="text-textPrimary">{p.unitId}</strong> | Duty Status: <strong className="text-textPrimary">{p.status}</strong>
        </p>
      </div>

      <div className="text-right flex-shrink-0 text-xs text-textMuted font-medium">
        Assessment generated:
        <span className="block font-bold text-textSecondary mt-0.5">
          {new Date(profile.risk.generatedAt || '').toLocaleDateString('en-US', {
            day: '2-digit',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit',
          })}
        </span>
      </div>
    </div>
  );
};
export default ProfileHeader;
