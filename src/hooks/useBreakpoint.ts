import { useState, useEffect } from 'react';

export type Breakpoint = 'mobile' | 'tablet' | 'desktop';

export const useBreakpoint = (): Breakpoint => {
  const [breakpoint, setBreakpoint] = useState<Breakpoint>('desktop');

  useEffect(() => {
    const mobileQuery = window.matchMedia('(max-width: 767px)');
    const tabletQuery = window.matchMedia('(min-width: 768px) and (max-width: 1199px)');
    
    const updateBreakpoint = () => {
      if (mobileQuery.matches) {
        setBreakpoint('mobile');
      } else if (tabletQuery.matches) {
        setBreakpoint('tablet');
      } else {
        setBreakpoint('desktop');
      }
    };

    // Run once initially
    updateBreakpoint();

    // Add listeners
    if (mobileQuery.addEventListener) {
      mobileQuery.addEventListener('change', updateBreakpoint);
      tabletQuery.addEventListener('change', updateBreakpoint);
    } else {
      // Fallback for older browsers
      mobileQuery.addListener(updateBreakpoint);
      tabletQuery.addListener(updateBreakpoint);
    }

    return () => {
      if (mobileQuery.removeEventListener) {
        mobileQuery.removeEventListener('change', updateBreakpoint);
        tabletQuery.removeEventListener('change', updateBreakpoint);
      } else {
        mobileQuery.removeListener(updateBreakpoint);
        tabletQuery.removeListener(updateBreakpoint);
      }
    };
  }, []);

  return breakpoint;
};
export default useBreakpoint;
