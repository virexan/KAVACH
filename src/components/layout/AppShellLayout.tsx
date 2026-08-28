import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import TopHeader from './TopHeader';
import SideNav, { IconRenderer } from './SideNav';
import Footer from './Footer';
import DemoDataBanner from './DemoDataBanner';
import ToastContainer from '../feedback/ToastContainer';
import Drawer from '../ui/Drawer';
import ContentOutlet from './ContentOutlet';
import { useAuthStore } from '@/store/authStore';
import { useSessionTimeout } from '@/hooks/useSessionTimeout';
import { personnelNav, officerNav, commanderNav, adminNav } from '@/config/navigation';

export const AppShellLayout: React.FC = () => {
  // Activate inactivity tracking and token auto-refresh
  useSessionTimeout();

  const { user, isAuthenticated } = useAuthStore();
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  if (!isAuthenticated || !user) {
    return null; // Let the AuthGuard handle redirects
  }

  // Load correct NavConfig matching the active authenticated role
  const getNavConfig = (role: string) => {
    switch (role) {
      case 'PERSONNEL':
        return personnelNav;
      case 'WELFARE_OFFICER':
        return officerNav;
      case 'COMMANDER':
        return commanderNav;
      case 'ADMIN':
        return adminNav;
      default:
        return [];
    }
  };

  const navConfig = getNavConfig(user.role);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Top Warning Banner */}
      <DemoDataBanner />

      {/* Main Top Header */}
      <TopHeader onToggleMobileMenu={() => setIsMobileDrawerOpen(true)} />

      {/* Main Frame */}
      <div className="flex-1 flex overflow-hidden">
        {/* Desktop Side Navigation */}
        <SideNav navConfig={navConfig} />

        {/* Mobile Navigation Drawer */}
        <Drawer
          isOpen={isMobileDrawerOpen}
          onClose={() => setIsMobileDrawerOpen(false)}
          title="Navigation"
          placement="left"
          className="max-w-[280px]"
          footer={
            <div className="text-center w-full text-xs text-textMuted select-none">
              KAVACH Platform
            </div>
          }
        >
          <div className="space-y-6">
            {navConfig.map((section, idx) => (
              <div key={idx} className="space-y-1.5">
                {section.title && (
                  <h4 className="px-3 text-[10px] font-bold text-textMuted uppercase tracking-widest">
                    {section.title}
                  </h4>
                )}
                <ul className="space-y-1">
                  {section.items.map((item) => (
                    <li key={item.path} onClick={() => setIsMobileDrawerOpen(false)}>
                      <NavLink
                        to={item.path}
                        className={({ isActive }) =>
                          `flex items-center gap-3 px-3 py-2 text-sm font-semibold rounded-md transition-colors ${
                            isActive
                              ? 'bg-primary/10 text-primary'
                              : 'text-textSecondary hover:bg-surfaceAlt hover:text-textPrimary'
                          }`
                        }
                      >
                        <IconRenderer name={item.icon} className="w-5 h-5 flex-shrink-0" />
                        <span>{item.label}</span>
                      </NavLink>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Drawer>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
          <main className="flex-1 p-6 md:p-8">
            <ContentOutlet />
          </main>

          {/* Footer */}
          <Footer />
        </div>
      </div>

      {/* Floating Notifications */}
      <ToastContainer />
    </div>
  );
};
export default AppShellLayout;
