import React from 'react';

export interface PanelProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  actions?: React.ReactNode;
}

export const Panel: React.FC<PanelProps> = ({ title, actions, children, className = '', ...props }) => {
  return (
    <div
      className={`bg-surface border border-border rounded-lg shadow-panel ${className}`}
      {...props}
    >
      {(title || actions) && (
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          {title && <h3 className="text-base font-bold text-textPrimary">{title}</h3>}
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
      )}
      <div className="p-6">{children}</div>
    </div>
  );
};
export default Panel;
