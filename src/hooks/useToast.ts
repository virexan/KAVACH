import { useUIStore } from '@/store/uiStore';
import type { ToastType } from '@/store/uiStore';

export const useToast = () => {
  const addToast = useUIStore((state) => state.addToast);
  const removeToast = useUIStore((state) => state.removeToast);
  const toasts = useUIStore((state) => state.toasts);

  const show = (message: string, type: ToastType = 'info', title?: string, duration?: number) => {
    addToast({ message, type, title, duration });
  };

  return {
    show,
    success: (message: string, title?: string, duration?: number) => show(message, 'success', title, duration),
    warning: (message: string, title?: string, duration?: number) => show(message, 'warning', title, duration),
    error: (message: string, title?: string, duration?: number) => show(message, 'error', title, duration),
    info: (message: string, title?: string, duration?: number) => show(message, 'info', title, duration),
    remove: removeToast,
    toasts,
  };
};
export default useToast;
