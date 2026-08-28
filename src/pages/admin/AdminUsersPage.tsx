import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import adminService from '@/services/adminService';
import type { AdminUser, UserRole, AccountStatus } from '@/services/adminService';
import UserTable from '@/components/admin/UserTable';
import Select from '@/components/ui/Select';
import Skeleton from '@/components/ui/Skeleton';
import EmptyState from '@/components/ui/EmptyState';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';

export const AdminUsersPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [role, setRole] = useState('ALL');
  const [status, setStatus] = useState('ALL');

  // Confirmation modal states (FR-16, FR-17)
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);

  // Form states
  const [targetRole, setTargetRole] = useState<UserRole>('PERSONNEL');
  const [targetStatus, setTargetStatus] = useState<AccountStatus>('ACTIVE');
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);

  const { data: usersRes, isLoading, isError, refetch } = useQuery({
    queryKey: ['admin-users-list', search, role, status],
    queryFn: () => adminService.getUsers({ search, role, status }),
  });

  const handleRoleChangeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;
    setIsSubmitLoading(true);
    try {
      await adminService.updateUserRole(selectedUser.id, targetRole);
      setShowRoleModal(false);
      refetch();
    } finally {
      setIsSubmitLoading(false);
    }
  };

  const handleStatusSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;
    setIsSubmitLoading(true);
    try {
      await adminService.updateUserStatus(selectedUser.id, targetStatus);
      setShowStatusModal(true); // Wait, close it
      setShowStatusModal(false);
      refetch();
    } finally {
      setIsSubmitLoading(false);
    }
  };

  const roleOptions = [
    { label: 'All Roles', value: 'ALL' },
    { label: 'Personnel', value: 'PERSONNEL' },
    { label: 'Welfare Officer', value: 'WELFARE_OFFICER' },
    { label: 'Commander', value: 'COMMANDER' },
    { label: 'Admin', value: 'ADMIN' }
  ];

  const statusOptions = [
    { label: 'All Statuses', value: 'ALL' },
    { label: 'Active', value: 'ACTIVE' },
    { label: 'Inactive', value: 'INACTIVE' },
    { label: 'Suspended', value: 'SUSPENDED' },
    { label: 'Pending', value: 'PENDING' }
  ];

  const list = usersRes?.data || [];

  return (
    <div className="space-y-6 select-none font-sans text-left animate-fadeIn">
      <div>
        <h1 className="text-xl font-black text-textPrimary leading-tight">User Administration</h1>
        <p className="text-xs text-textMuted mt-0.5">Manage user access configurations and role scope mappings.</p>
      </div>

      {/* Filters Toolbar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end bg-surface border border-border p-4 rounded-lg">
        <div className="space-y-0.5 text-xs font-sans text-left">
          <label className="font-semibold text-textSecondary block mb-1">Search User Name</label>
          <input
            type="text"
            placeholder="Search by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full p-2 border border-border rounded bg-surface text-textPrimary text-xs focus:outline-none"
          />
        </div>
        <Select label="Filter Role" options={roleOptions} value={role} onChange={(e) => setRole(e.target.value)} />
        <Select label="Filter Status" options={statusOptions} value={status} onChange={(e) => setStatus(e.target.value)} />
      </div>

      {isLoading ? (
        <Skeleton variant="block" className="h-48 w-full" />
      ) : isError ? (
        <div className="bg-danger/10 border border-danger/20 text-danger text-xs font-semibold p-4 rounded-md text-center">
          Unable to load users. Please retry. (FR-69)
        </div>
      ) : list.length === 0 ? (
        <EmptyState
          title="No users found"
          description="Try adjusting your filters or search terms."
          className="bg-surface border border-border"
        />
      ) : (
        <div className="animate-fadeIn">
          <UserTable
            users={list}
            onView={(id) => {
              alert(`Account Details Profile Page for user index: ${id}`);
            }}
            onChangeRole={(user) => {
              setSelectedUser(user);
              setTargetRole(user.role);
              setShowRoleModal(true);
            }}
            onChangeStatus={(user, newStatus) => {
              setSelectedUser(user);
              setTargetStatus(newStatus);
              setShowStatusModal(true);
            }}
          />
        </div>
      )}

      {/* Role Change Modal (FR-16) */}
      <Modal
        isOpen={showRoleModal}
        onClose={() => setShowRoleModal(false)}
        title="Change User Access Role"
        className="max-w-sm w-full"
      >
        {selectedUser && (
          <form onSubmit={handleRoleChangeSubmit} className="space-y-4 font-sans text-left">
            <p className="text-xs text-textSecondary leading-relaxed">
              Changing this role will modify the platform authorization privileges for user{' '}
              <strong>{selectedUser.displayName}</strong>.
            </p>

            <div className="space-y-1 text-xs">
              <label className="font-semibold text-textSecondary block">New Role</label>
              <select
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value as UserRole)}
                className="w-full p-2.5 border border-border rounded bg-surface text-textPrimary text-xs focus:outline-none"
              >
                <option value="PERSONNEL">Personnel Portal</option>
                <option value="WELFARE_OFFICER">Welfare Officer Space</option>
                <option value="COMMANDER">Command Analytics</option>
                <option value="ADMIN">Governance console</option>
              </select>
            </div>

            <div className="flex gap-2 justify-end pt-2 border-t border-border mt-4">
              <button
                type="button"
                onClick={() => setShowRoleModal(false)}
                disabled={isSubmitLoading}
                className="px-3.5 py-2 border border-border hover:bg-surfaceAlt text-textSecondary rounded text-xs font-semibold focus:outline-none"
              >
                Cancel
              </button>
              <Button type="submit" variant="primary" size="sm" isLoading={isSubmitLoading}>
                Confirm Change
              </Button>
            </div>
          </form>
        )}
      </Modal>

      {/* Status Modification Modal (FR-17) */}
      <Modal
        isOpen={showStatusModal}
        onClose={() => setShowStatusModal(false)}
        title="Modify User Status"
        className="max-w-sm w-full"
      >
        {selectedUser && (
          <form onSubmit={handleStatusSubmit} className="space-y-4 font-sans text-left">
            <p className="text-xs text-textSecondary leading-relaxed">
              Are you sure you want to change the status of <strong>{selectedUser.displayName}</strong> to{' '}
              <strong className="uppercase">{targetStatus.toLowerCase()}</strong>?
            </p>

            <div className="flex gap-2 justify-end pt-2 border-t border-border mt-4">
              <button
                type="button"
                onClick={() => setShowStatusModal(false)}
                disabled={isSubmitLoading}
                className="px-3.5 py-2 border border-border hover:bg-surfaceAlt text-textSecondary rounded text-xs font-semibold focus:outline-none"
              >
                Cancel
              </button>
              <Button
                type="submit"
                variant={targetStatus === 'SUSPENDED' ? 'danger' : 'primary'}
                size="sm"
                isLoading={isSubmitLoading}
              >
                Confirm status
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};
export default AdminUsersPage;
