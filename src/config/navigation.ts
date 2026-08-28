import type { NavConfig } from '@/components/layout/SideNav';

export const personnelNav: NavConfig = [
  {
    title: 'Personnel Welfare Portal',
    items: [
      { label: 'Dashboard', path: '/personnel', icon: 'LayoutDashboard' },
      { label: 'Daily Check-In', path: '/personnel/check-in', icon: 'Activity' },
      { label: 'Wellness History', path: '/personnel/history', icon: 'History' },
      { label: 'Trends', path: '/personnel/trends', icon: 'TrendingUp' },
      { label: 'Welfare AI Assistant', path: '/personnel/assistant', icon: 'MessageSquare' },
      { label: 'Recommendations', path: '/personnel/recommendations', icon: 'Sparkles' },
      { label: 'Resources', path: '/personnel/resources', icon: 'FileText' },
      { label: 'Consent Management', path: '/personnel/consent', icon: 'CheckSquare' },
      { label: 'Notifications', path: '/personnel/notifications', icon: 'Bell' },
      { label: 'Profile/Settings', path: '/personnel/settings', icon: 'Settings' },
    ],
  },
];

export const officerNav: NavConfig = [
  {
    title: 'Welfare Officer Space',
    items: [
      { label: 'Dashboard', path: '/officer', icon: 'LayoutDashboard' },
      { label: 'Risk Alerts', path: '/officer/alerts', icon: 'AlertTriangle', badgeCount: 2 },
      { label: 'Cases Manager', path: '/officer/cases', icon: 'FolderOpen' },
      { label: 'Recommendations', path: '/officer/recommendations', icon: 'Sparkles' },
      { label: 'Interventions', path: '/officer/interventions', icon: 'ShieldAlert' },
      { label: 'Risk Trends', path: '/officer/trends', icon: 'TrendingUp' },
      { label: 'Welfare AI Assistant', path: '/officer/assistant', icon: 'MessageSquare' },
      { label: 'Notifications', path: '/officer/notifications', icon: 'Bell' },
    ],
  },
];

export const commanderNav: NavConfig = [
  {
    title: 'Command Analytics',
    items: [
      { label: 'Dashboard', path: '/commander', icon: 'LayoutDashboard' },
      { label: 'Unit Detail (Unit 7)', path: '/commander/unit/UNIT-7', icon: 'Users' },
      { label: 'Welfare Trends', path: '/commander/trends', icon: 'TrendingUp' },
      { label: 'Workload', path: '/commander/workload', icon: 'BarChart3' },
      { label: 'Recommendations', path: '/commander/recommendations', icon: 'Sparkles' },
      { label: 'Welfare AI Assistant', path: '/commander/assistant', icon: 'MessageSquare' },
      { label: 'Welfare Reports', path: '/commander/reports', icon: 'FileText' },
      { label: 'System Alerts', path: '/commander/notifications', icon: 'AlertTriangle', badgeCount: 2 },
    ],
  },
];

export const adminNav: NavConfig = [
  {
    title: 'Administration',
    items: [
      { label: 'Dashboard', path: '/admin', icon: 'LayoutDashboard' },
      { label: 'Users Directory', path: '/admin/users', icon: 'Users' },
      { label: 'Roles & Permissions', path: '/admin/roles', icon: 'Lock' },
      { label: 'Units Scope', path: '/admin/units', icon: 'Layers' },
      { label: 'Consent Governance', path: '/admin/consent', icon: 'Shield' },
      { label: 'Audit Trail', path: '/admin/audit', icon: 'Terminal' },
      { label: 'Model Management', path: '/admin/ai', icon: 'Cpu' },
      { label: 'Welfare AI Assistant', path: '/admin/assistant', icon: 'MessageSquare' },
      { label: 'System Health', path: '/admin/system-health', icon: 'Activity' },
      { label: 'System Settings', path: '/admin/settings', icon: 'Settings' },
    ],
  },
];
