import React from 'react';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info';
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'secondary', className = '', ...props }) => {
  const styles = {
    primary: 'bg-primary/10 text-primary border-primary/20',
    secondary: 'bg-surfaceAlt text-textSecondary border-border',
    success: 'bg-success/10 text-success border-success/20',
    warning: 'bg-warning/10 text-warning border-warning/20',
    danger: 'bg-danger/10 text-danger border-danger/20',
    info: 'bg-info/10 text-info border-info/20',
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border select-none ${styles[variant]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
};
export default Badge;
