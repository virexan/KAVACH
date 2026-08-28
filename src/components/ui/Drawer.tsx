import React, { useEffect, useRef } from 'react';
import Button from './Button';

export interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  placement?: 'left' | 'right';
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}

export const Drawer: React.FC<DrawerProps> = ({
  isOpen,
  onClose,
  title,
  placement = 'right',
  children,
  footer,
  className = '',
}) => {
  const drawerRef = useRef<HTMLDivElement>(null);
  const previousFocus = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      previousFocus.current = document.activeElement as HTMLElement;
      document.body.classList.add('focus-trap-active');

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose();
        if (e.key === 'Tab') {
          const focusableElements = drawerRef.current?.querySelectorAll(
            'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
          );
          if (focusableElements && focusableElements.length > 0) {
            const first = focusableElements[0] as HTMLElement;
            const last = focusableElements[focusableElements.length - 1] as HTMLElement;
            if (e.shiftKey && document.activeElement === first) {
              last.focus();
              e.preventDefault();
            } else if (!e.shiftKey && document.activeElement === last) {
              first.focus();
              e.preventDefault();
            }
          }
        }
      };

      window.addEventListener('keydown', handleKeyDown);

      setTimeout(() => {
        const firstFocus = drawerRef.current?.querySelector('button, input, select, textarea, a') as HTMLElement;
        if (firstFocus) firstFocus.focus();
        else drawerRef.current?.focus();
      }, 50);

      return () => {
        window.removeEventListener('keydown', handleKeyDown);
        document.body.classList.remove('focus-trap-active');
        if (previousFocus.current) previousFocus.current.focus();
      };
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const placementClasses = {
    left: 'left-0 h-full border-r',
    right: 'right-0 h-full border-l',
  };

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-textPrimary/40 backdrop-blur-xs transition-opacity duration-200"
        onClick={onClose}
      />

      {/* Drawer Body */}
      <div
        ref={drawerRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby="drawer-title"
        className={`fixed top-0 bottom-0 w-full max-w-sm bg-surface border-border shadow-modal z-10 flex flex-col focus:outline-none ${placementClasses[placement]} ${className}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border select-none">
          <h3 id="drawer-title" className="text-base font-bold text-textPrimary">
            {title}
          </h3>
          <button
            onClick={onClose}
            aria-label="Close drawer"
            className="p-1 rounded-md text-textMuted hover:bg-surfaceAlt hover:text-textSecondary transition-colors focus:outline-none"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1 text-sm text-textSecondary leading-relaxed">
          {children}
        </div>

        {/* Footer */}
        {footer ? (
          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-border bg-surfaceAlt/20">
            {footer}
          </div>
        ) : (
          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-border bg-surfaceAlt/20">
            <Button variant="secondary" size="sm" onClick={onClose}>
              Close
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
export default Drawer;
