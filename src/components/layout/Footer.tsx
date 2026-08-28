import React from 'react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  const env = import.meta.env.VITE_APP_ENV || 'development';
  
  return (
    <footer className="bg-surface border-t border-border px-6 py-4 flex flex-col sm:flex-row items-center justify-between text-xs text-textMuted select-none gap-3">
      <div className="flex items-center gap-2">
        <span>© {new Date().getFullYear()} KAVACH. All rights reserved.</span>
        <span className="text-border">|</span>
        <span>Version 1.0.0 ({env})</span>
      </div>
      
      <div className="flex items-center gap-4 font-semibold">
        <Link to="/privacy" className="hover:text-primary transition-colors">
          Privacy Notice
        </Link>
        <span className="text-border">|</span>
        <a
          href="mailto:support@kavach.gov.in"
          className="hover:text-primary transition-colors"
        >
          Support
        </a>
      </div>
    </footer>
  );
};
export default Footer;
