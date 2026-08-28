export type RiskLevel = 'LOW' | 'MODERATE' | 'ELEVATED' | 'HIGH';

export interface ColorTokens {
  background: string;
  surface: string;
  surfaceAlt: string;
  border: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  primary: string;
  primaryHover: string;
  success: string;
  warning: string;
  danger: string;
  info: string;
  risk: Record<RiskLevel, string>;
}

export interface DesignTokens {
  colors: ColorTokens;
  fontSizes: {
    display: string;
    h1: string;
    h2: string;
    h3: string;
    h4: string;
    body: string;
    bodySmall: string;
    caption: string;
    label: string;
  };
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    xxl: string;
  };
  radius: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
    full: string;
  };
  shadows: {
    card: string;
    panel: string;
    modal: string;
    dropdown: string;
  };
  motion: {
    fast: string;
    normal: string;
    slow: string;
    ease: string;
  };
}

export const tokens: DesignTokens = {
  colors: {
    background: '#f8fafc',      // slate-50
    surface: '#ffffff',         // white
    surfaceAlt: '#f1f5f9',      // slate-100
    border: '#e2e8f0',          // slate-200
    textPrimary: '#0f172a',     // slate-900
    textSecondary: '#334155',   // slate-700
    textMuted: '#64748b',       // slate-500
    primary: '#0f766e',         // teal-700 (trustworthy, calm)
    primaryHover: '#0d9488',    // teal-600
    success: '#10b981',        // emerald-500
    warning: '#f59e0b',        // amber-500
    danger: '#ef4444',         // red-500
    info: '#3b82f6',           // blue-500
    risk: {
      LOW: '#3b82f6',          // Desaturated Blue
      MODERATE: '#f59e0b',     // Amber
      ELEVATED: '#f97316',     // Orange
      HIGH: '#dc2626',         // Desaturated Red
    },
  },
  fontSizes: {
    display: '2.25rem',        // 36px
    h1: '1.875rem',            // 30px
    h2: '1.5rem',              // 24px
    h3: '1.25rem',             // 20px
    h4: '1.125rem',            // 18px
    body: '1rem',              // 16px (preferred for readability)
    bodySmall: '0.875rem',     // 14px (minimum standard)
    caption: '0.75rem',        // 12px
    label: '0.875rem',         // 14px
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    xxl: '48px',
  },
  radius: {
    sm: '4px',
    md: '6px',
    lg: '8px',
    xl: '12px',
    full: '9999px',
  },
  shadows: {
    card: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)',
    panel: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
    modal: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
    dropdown: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
  },
  motion: {
    fast: '150ms',
    normal: '200ms',
    slow: '300ms',
    ease: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },
};
