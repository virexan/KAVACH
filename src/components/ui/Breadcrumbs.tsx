import React from 'react';
import { Link, useMatches } from 'react-router-dom';

interface MatchHandle {
  breadcrumb?: string | ((data: any) => string);
}

export const Breadcrumbs: React.FC = () => {
  const matches = useMatches();

  const crumbs = matches
    .filter((match) => {
      const handle = match.handle as MatchHandle;
      return handle && handle.breadcrumb;
    })
    .map((match) => {
      const handle = match.handle as MatchHandle;
      const breadcrumb = handle.breadcrumb;
      const label = typeof breadcrumb === 'function' ? breadcrumb(match.data) : breadcrumb;
      
      return {
        label,
        path: match.pathname,
      };
    });

  if (crumbs.length === 0) return null;

  return (
    <nav aria-label="Breadcrumb" className="text-xs text-textMuted select-none mb-4 flex items-center gap-1.5 font-medium">
      {crumbs.map((crumb, index) => {
        const isLast = index === crumbs.length - 1;
        return (
          <React.Fragment key={crumb.path}>
            {index > 0 && <span className="text-textMuted/40">/</span>}
            {isLast ? (
              <span className="text-textSecondary font-semibold" aria-current="page">
                {crumb.label}
              </span>
            ) : (
              <Link to={crumb.path} className="hover:text-primary transition-colors">
                {crumb.label}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};
export default Breadcrumbs;
