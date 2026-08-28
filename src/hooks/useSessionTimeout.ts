import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { useToast } from '@/hooks/useToast';

const REFRESH_INTERVAL = 10 * 60 * 1000; // Refresh token every 10 mins
const IDLE_TIMEOUT = 15 * 60 * 1000;    // Logout after 15 mins of idle
const WARNING_TIMEOUT = 13 * 60 * 1000; // Warn after 13 mins of idle

export const useSessionTimeout = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const { isAuthenticated, refresh, logout } = useAuthStore();
  const lastActivity = useRef<number>(Date.now());
  const warnedRef = useRef<boolean>(false);

  useEffect(() => {
    if (!isAuthenticated) return;

    // 1. Silent token refresh interval (FR-2.4)
    const refreshTimer = setInterval(async () => {
      const success = await refresh();
      if (!success) {
        navigate('/session-expired');
      }
    }, REFRESH_INTERVAL);

    // 2. Event listeners to track activity
    const handleActivity = () => {
      lastActivity.current = Date.now();
      if (warnedRef.current) {
        warnedRef.current = false;
        toast.info('Session activity resumed.', 'Activity Noted');
      }
    };

    window.addEventListener('mousemove', handleActivity);
    window.addEventListener('mousedown', handleActivity);
    window.addEventListener('keypress', handleActivity);
    window.addEventListener('scroll', handleActivity);
    window.addEventListener('click', handleActivity);

    // 3. Periodic idle evaluation loop (FR-2.5)
    const idleCheckTimer = setInterval(async () => {
      const idleDuration = Date.now() - lastActivity.current;

      if (idleDuration >= IDLE_TIMEOUT) {
        clearInterval(refreshTimer);
        clearInterval(idleCheckTimer);
        await logout();
        navigate('/session-expired');
      } else if (idleDuration >= WARNING_TIMEOUT && !warnedRef.current) {
        warnedRef.current = true;
        toast.warning(
          'Your session has been idle and will expire soon due to inactivity guidelines.',
          'Session Timeout Approaching'
        );
      }
    }, 15 * 1000); // Check idle duration every 15 seconds

    return () => {
      clearInterval(refreshTimer);
      clearInterval(idleCheckTimer);
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('mousedown', handleActivity);
      window.removeEventListener('keypress', handleActivity);
      window.removeEventListener('scroll', handleActivity);
      window.removeEventListener('click', handleActivity);
    };
  }, [isAuthenticated, refresh, logout, navigate, toast]);
};
export default useSessionTimeout;
