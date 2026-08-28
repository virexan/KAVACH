import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import adminService from '@/services/adminService';
import AdminHeader from '@/components/admin/AdminHeader';
import AdminMetricCard from '@/components/admin/AdminMetricCard';
import SystemHealthOverview from '@/components/admin/SystemHealthOverview';
import Card from '@/components/ui/Card';
import Skeleton from '@/components/ui/Skeleton';
import ErrorState from '@/components/ui/ErrorState';

export const AdminDashboardPage: React.FC = () => {
  const navigate = useNavigate();

  const { data: healthRes, isLoading: isHealthLoading, isError: isHealthError, refetch: refetchHealth } = useQuery({
    queryKey: ['admin-health-overview'],
    queryFn: () => adminService.getSystemHealth(),
  });

  const { data: usersRes, isLoading: isUsersLoading } = useQuery({
    queryKey: ['admin-users-summary'],
    queryFn: () => adminService.getUsers(),
  });

  const { data: auditRes, isLoading: isAuditLoading } = useQuery({
    queryKey: ['admin-audit-summary'],
    queryFn: () => adminService.getAuditLogs(),
  });

  if (isHealthLoading || isUsersLoading || isAuditLoading) {
    return (
      <div className="space-y-6">
        <Skeleton variant="line" className="h-8 w-1/3" />
        <Skeleton variant="block" className="h-48 w-full" />
      </div>
    );
  }

  if (isHealthError || !healthRes) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <ErrorState
          title="Health Overview Failed"
          description="We couldn't retrieve platform service health logs. (FR-69)"
          retryLabel="Try Again"
          onRetry={() => refetchHealth()}
          className="max-w-md bg-surface border border-border"
        />
      </div>
    );
  }

  const users = usersRes?.data || [];
  const auditLogs = auditRes?.data || [];
  const healthList = healthRes.data;

  const totalUsersCount = users.length;
  const personnelCount = users.filter((u) => u.role === 'PERSONNEL').length;
  const officerCount = users.filter((u) => u.role === 'WELFARE_OFFICER').length;
  const commanderCount = users.filter((u) => u.role === 'COMMANDER').length;

  return (
    <div className="space-y-6 select-none font-sans text-left animate-fadeIn">
      <AdminHeader updatedAt={new Date().toISOString()} />

      {/* Metrics widgets */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <AdminMetricCard title="Total Platform Users" value={totalUsersCount} description="Active accounts tracked under KAVACH security." />
        <AdminMetricCard title="Personnel Accounts" value={personnelCount} description="Active personnel self-reporting portals." />
        <AdminMetricCard title="Welfare Officers" value={officerCount} description="Active welfare-officer case management logs." />
        <AdminMetricCard title="Authorized Commanders" value={commanderCount} description="Active aggregate intelligence dashboards." />
      </div>

      <SystemHealthOverview
        services={healthList}
        onSelectService={() => navigate('/admin/system-health')}
      />

      {/* Recent Activity Logs (FR-47) */}
      <Card className="bg-surface border border-border p-5 space-y-4">
        <h3 className="font-bold text-textPrimary text-base">Recent Governance Activity</h3>
        <div className="divide-y divide-border/60">
          {auditLogs.slice(0, 5).map((log) => (
            <div key={log.id} className="py-2.5 flex justify-between items-center text-xs text-textSecondary font-medium">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                <span>{log.actorDisplayName} performed: <strong className="text-textPrimary">{log.action.replace(/_/g, ' ')}</strong></span>
              </div>
              <span className="text-[10px] text-textMuted font-bold">
                {new Date(log.timestamp).toLocaleTimeString()}
              </span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
export default AdminDashboardPage;
