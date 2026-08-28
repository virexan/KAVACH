import { useAuthStore } from '@/store/authStore';

export const usePermission = (permission: string): boolean => {
  const user = useAuthStore((state) => state.user);
  if (!user || !user.permissions) return false;
  return user.permissions.includes(permission);
};
export default usePermission;
