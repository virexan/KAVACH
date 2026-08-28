import React from 'react';
import { useNavigate } from 'react-router-dom';
import Avatar from '../ui/Avatar';
import Popover from '../ui/Popover';
import Badge from '../ui/Badge';
import { useAuthStore } from '@/store/authStore';
import { useToast } from '@/hooks/useToast';
import { apiClient } from '@/lib/apiClient';

interface TopHeaderProps {
  onToggleMobileMenu?: () => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({ onToggleMobileMenu }) => {
  const navigate = useNavigate();
  const toast = useToast();
  const { user, logout, isAuthenticated } = useAuthStore();
  const isMockActive = apiClient.useMocks();

  const handleSignOut = async () => {
    await logout();
    toast.success("You've been logged out", 'Signed Out');
    navigate('/login');
  };

  const getHumanReadableRole = (role: string): string => {
    switch (role) {
      case 'PERSONNEL':
        return 'Personnel';
      case 'WELFARE_OFFICER':
        return 'Welfare Officer';
      case 'COMMANDER':
        return 'Commander';
      case 'ADMIN':
        return 'Administrator';
      default:
        return role;
    }
  };

  if (!isAuthenticated || !user) return null;

  return (
    <header className="h-16 bg-surface border-b border-border px-4 md:px-6 flex items-center justify-between sticky top-0 z-20 select-none shadow-card">
      <div className="flex items-center gap-3">
        {/* Mobile menu trigger */}
        <button
          onClick={onToggleMobileMenu}
          className="p-2 rounded-md hover:bg-surfaceAlt text-textSecondary md:hidden focus:outline-none"
          aria-label="Toggle Navigation Menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {/* Brand Logo & Name */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white font-black text-sm">
            K
          </div>
          <span className="font-extrabold text-lg text-textPrimary tracking-tight">
            KAVACH
          </span>
        </div>

        {/* Demo Watermark Badge */}
        {isMockActive && (
          <Badge variant="info" className="text-[10px] font-bold py-0.5 px-2 select-none uppercase tracking-wide">
            Demo Data
          </Badge>
        )}
      </div>

      <div className="flex items-center gap-4">
        {/* Notifications indicator placeholder */}
        <button
          aria-label="Notifications"
          className="relative p-2 rounded-full hover:bg-surfaceAlt text-textSecondary focus:outline-none transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
            />
          </svg>
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-danger rounded-full border border-surface" />
        </button>

        {/* User Account Popover */}
        <Popover
          trigger={
            <button className="flex items-center gap-2.5 hover:opacity-85 transition-opacity focus:outline-none">
              <Avatar name={user.displayName} initials={user.avatarInitials} size="sm" />
              <div className="hidden sm:flex flex-col text-left">
                <span className="text-sm font-semibold text-textPrimary leading-none">
                  {user.displayName}
                </span>
                <span className="text-[10px] font-medium text-textMuted mt-0.5">
                  {getHumanReadableRole(user.role)}
                </span>
              </div>
            </button>
          }
          placement="bottom-end"
        >
          <div className="w-48 flex flex-col gap-2">
            <div className="px-2 py-1.5 border-b border-border">
              <p className="text-xs font-semibold text-textPrimary">{user.displayName}</p>
              <p className="text-[10px] text-textMuted mt-0.5">ID: {user.serviceId}</p>
            </div>
            <button
              onClick={handleSignOut}
              className="w-full text-left px-2 py-1.5 rounded hover:bg-danger/10 text-danger text-xs font-semibold transition-colors flex items-center gap-2 focus:outline-none"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              Sign Out
            </button>
          </div>
        </Popover>
      </div>
    </header>
  );
};
export default TopHeader;
