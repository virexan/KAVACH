import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import adminService from '@/services/adminService';
import Card from '@/components/ui/Card';
import Skeleton from '@/components/ui/Skeleton';
import ErrorState from '@/components/ui/ErrorState';

export const AdminUserPage: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();

  const { data: userRes, isLoading, isError } = useQuery({
    queryKey: ['admin-user-profile', userId],
    queryFn: () => adminService.getUserById(userId!),
    enabled: !!userId,
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton variant="line" className="h-8 w-1/3" />
        <Skeleton variant="block" className="h-48 w-full" />
      </div>
    );
  }

  if (isError || !userRes) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <ErrorState
          title="Profile Load Failed"
          description="Unable to load this user's profile details."
          retryLabel="Back to Directory"
          onRetry={() => navigate('/admin/users')}
          className="max-w-md bg-surface border border-border"
        />
      </div>
    );
  }

  const user = userRes.data;

  return (
    <div className="space-y-6 select-none font-sans text-left animate-fadeIn">
      <div className="border-b border-border pb-4">
        <button
          onClick={() => navigate('/admin/users')}
          className="text-xs font-bold text-textMuted hover:text-primary transition-colors flex items-center gap-1.5 focus:outline-none mb-1 font-sans"
        >
          ← Back to Directory
        </button>
        <h1 className="text-2xl font-black text-textPrimary leading-tight">
          User Account Profile
        </h1>
      </div>

      <Card className="bg-surface border border-border p-6 space-y-4 max-w-md font-sans">
        <h3 className="font-bold text-textPrimary text-base border-b border-border pb-2">
          Account Governance Information
        </h3>
        
        <div className="space-y-3 text-xs leading-relaxed">
          <div className="grid grid-cols-2">
            <span className="font-semibold text-textSecondary font-sans">Full Name:</span>
            <span className="text-textPrimary font-bold">{user.displayName}</span>
          </div>
          <div className="grid grid-cols-2">
            <span className="font-semibold text-textSecondary font-sans">Account ID:</span>
            <span className="text-textPrimary font-semibold">{user.id}</span>
          </div>
          <div className="grid grid-cols-2">
            <span className="font-semibold text-textSecondary font-sans">Active Role:</span>
            <span className="text-textPrimary font-bold uppercase">{user.role}</span>
          </div>
          <div className="grid grid-cols-2">
            <span className="font-semibold text-textSecondary font-sans">Assigned Unit ID:</span>
            <span className="text-textPrimary font-semibold">{user.unitId || '—'}</span>
          </div>
          <div className="grid grid-cols-2">
            <span className="font-semibold text-textSecondary font-sans">Status Tag:</span>
            <span className="text-textPrimary font-bold uppercase">{user.status}</span>
          </div>
          <div className="grid grid-cols-2 border-t border-border/40 pt-3">
            <span className="font-semibold text-textSecondary font-sans font-sans">Created on:</span>
            <span className="text-textMuted font-medium">{new Date(user.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      </Card>
    </div>
  );
};
export default AdminUserPage;
