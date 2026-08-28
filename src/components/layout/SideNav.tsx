import React from 'react';
import { NavLink } from 'react-router-dom';
import * as LucideIcons from 'lucide-react';
import { useUIStore } from '@/store/uiStore';
import { useBreakpoint } from '@/hooks/useBreakpoint';

export interface NavItem {
  label: string;
  path: string;
  icon: string;
  badgeCount?: number;
}

export interface NavSection {
  title?: string;
  items: NavItem[];
}

export type NavConfig = NavSection[];

interface SideNavProps {
  navConfig: NavConfig;
}

export const IconRenderer: React.FC<{ name: string; className?: string }> = ({ name, className }) => {
  const IconComponent = (LucideIcons as any)[name];
  if (!IconComponent) {
    return <LucideIcons.HelpCircle className={className} />;
  }
  return <IconComponent className={className} />;
};

export const SideNav: React.FC<SideNavProps> = ({ navConfig }) => {
  const { sidebarCollapsed, toggleSidebar } = useUIStore();
  const breakpoint = useBreakpoint();

  // Collapsed status based on breakpoint or desktop-toggle
  const isCollapsed = breakpoint === 'tablet' || (breakpoint === 'desktop' && sidebarCollapsed);

  return (
    <aside
      className={`bg-surface border-r border-border flex flex-col transition-all duration-200 select-none flex-shrink-0 relative ${
        isCollapsed ? 'w-16' : 'w-64'
      } ${breakpoint === 'mobile' ? 'hidden' : 'flex'}`}
    >
      {/* Scrollable Navigation Area */}
      <div className="flex-1 overflow-y-auto py-6 px-3 space-y-6">
        {navConfig.map((section, idx) => (
          <div key={idx} className="space-y-1.5">
            {section.title && !isCollapsed && (
              <h4 className="px-3 text-[10px] font-bold text-textMuted uppercase tracking-widest">
                {section.title}
              </h4>
            )}
            <ul className="space-y-1">
              {section.items.map((item) => (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2 text-sm font-semibold rounded-md transition-colors ${
                        isActive
                          ? 'bg-primary/10 text-primary'
                          : 'text-textSecondary hover:bg-surfaceAlt hover:text-textPrimary'
                      } ${isCollapsed ? 'justify-center' : ''}`
                    }
                  >
                    <IconRenderer name={item.icon} className="w-5 h-5 flex-shrink-0" />
                    {!isCollapsed && <span className="truncate">{item.label}</span>}
                    {item.badgeCount !== undefined && !isCollapsed && (
                      <span className="ml-auto bg-primary text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                        {item.badgeCount}
                      </span>
                    )}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Desktop Bottom Toggle Arrow */}
      {breakpoint === 'desktop' && (
        <div className="p-3 border-t border-border flex justify-end">
          <button
            onClick={toggleSidebar}
            className="p-1.5 rounded-md hover:bg-surfaceAlt text-textMuted hover:text-textSecondary transition-colors focus:outline-none"
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <svg
              className={`w-5 h-5 transition-transform duration-200 ${isCollapsed ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
            </svg>
          </button>
        </div>
      )}
    </aside>
  );
};
export default SideNav;
