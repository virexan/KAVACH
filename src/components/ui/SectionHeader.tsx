import React from 'react';

export interface SectionHeaderProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  className?: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  description,
  actions,
  className = '',
}) => {
  return (
    <div className={`flex flex-col gap-1 md:flex-row md:items-center md:justify-between pb-4 border-b border-border mb-6 ${className}`}>
      <div className="flex flex-col">
        <h2 className="text-xl font-bold tracking-tight text-textPrimary">{title}</h2>
        {description && <p className="text-sm text-textMuted">{description}</p>}
      </div>
      {actions && <div className="flex items-center gap-2 mt-2 md:mt-0">{actions}</div>}
    </div>
  );
};
export default SectionHeader;
