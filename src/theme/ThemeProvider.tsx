import React, { useEffect } from 'react';
import { tokens } from './tokens';

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  useEffect(() => {
    const root = document.documentElement;

    // Apply color tokens
    root.style.setProperty('--color-background', tokens.colors.background);
    root.style.setProperty('--color-surface', tokens.colors.surface);
    root.style.setProperty('--color-surface-alt', tokens.colors.surfaceAlt);
    root.style.setProperty('--color-border', tokens.colors.border);
    root.style.setProperty('--color-text-primary', tokens.colors.textPrimary);
    root.style.setProperty('--color-text-secondary', tokens.colors.textSecondary);
    root.style.setProperty('--color-text-muted', tokens.colors.textMuted);
    root.style.setProperty('--color-primary', tokens.colors.primary);
    root.style.setProperty('--color-primary-hover', tokens.colors.primaryHover);
    root.style.setProperty('--color-success', tokens.colors.success);
    root.style.setProperty('--color-warning', tokens.colors.warning);
    root.style.setProperty('--color-danger', tokens.colors.danger);
    root.style.setProperty('--color-info', tokens.colors.info);
    
    // Apply risk levels
    root.style.setProperty('--color-risk-low', tokens.colors.risk.LOW);
    root.style.setProperty('--color-risk-moderate', tokens.colors.risk.MODERATE);
    root.style.setProperty('--color-risk-elevated', tokens.colors.risk.ELEVATED);
    root.style.setProperty('--color-risk-high', tokens.colors.risk.HIGH);

    // Apply shadows
    root.style.setProperty('--shadow-card', tokens.shadows.card);
    root.style.setProperty('--shadow-panel', tokens.shadows.panel);
    root.style.setProperty('--shadow-modal', tokens.shadows.modal);
    root.style.setProperty('--shadow-dropdown', tokens.shadows.dropdown);

    // Apply radii
    root.style.setProperty('--radius-sm', tokens.radius.sm);
    root.style.setProperty('--radius-md', tokens.radius.md);
    root.style.setProperty('--radius-lg', tokens.radius.lg);
    root.style.setProperty('--radius-xl', tokens.radius.xl);

    // Apply motion
    root.style.setProperty('--transition-fast', tokens.motion.fast);
    root.style.setProperty('--transition-normal', tokens.motion.normal);
    root.style.setProperty('--transition-slow', tokens.motion.slow);
    root.style.setProperty('--ease-default', tokens.motion.ease);
  }, []);

  return <>{children}</>;
};
export default ThemeProvider;
