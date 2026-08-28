import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import adminService from '@/services/adminService';
import Button from '@/components/ui/Button';
import Skeleton from '@/components/ui/Skeleton';
import Modal from '@/components/ui/Modal';

export const AdminUnitsPage: React.FC = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);

  // Form states (FR-24)
  const [unitName, setUnitName] = useState('');
  const [unitId, setUnitId] = useState('');
  const [parentUnit, setParentUnit] = useState('HQ-FORCE');

  const { data: unitsRes, isLoading, refetch } = useQuery({
    queryKey: ['admin-units-list-page'],
    queryFn: () => adminService.getUnits(),
  });

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!unitName.trim() || !unitId.trim()) return;
    setIsSubmitLoading(true);
    try {
      await adminService.createUnit({
        id: unitId.trim(),
        name: unitName.trim(),
        parentId: parentUnit,
        status: 'ACTIVE',
      });
      setShowCreateModal(false);
      setUnitName('');
      setUnitId('');
      refetch();
    } finally {
      setIsSubmitLoading(false);
    }
  };

  const list = unitsRes?.data || [];

  return (
    <div className="space-y-6 select-none font-sans text-left animate-fadeIn">
      <div className="flex justify-between items-center border-b border-border pb-4">
        <div>
          <h1 className="text-xl font-black text-textPrimary leading-tight">Units & Force Scope</h1>
          <p className="text-xs text-textMuted mt-0.5">Manage organizational nodes and subunit mappings (FR-21).</p>
        </div>
        <Button variant="primary" size="sm" onClick={() => setShowCreateModal(true)} className="font-bold">
          Create Subunit
        </Button>
      </div>

      {isLoading ? (
        <Skeleton variant="block" className="h-48 w-full" />
      ) : (
        <div className="overflow-x-auto border border-border rounded-md bg-surface text-xs font-sans">
          <table className="w-full text-left border-collapse font-sans">
            <thead>
              <tr className="bg-surfaceAlt/60 text-xs font-bold text-textSecondary border-b border-border">
                <th className="p-3">Unit Scope</th>
                <th className="p-3">Subunit ID</th>
                <th className="p-3">Parent Organization</th>
                <th className="p-3">Personnel Count</th>
                <th className="p-3">Officer Count</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-xs font-sans">
              {list.map((u) => (
                <tr key={u.id} className="hover:bg-surfaceAlt/10">
                  <td className="p-3 font-semibold text-textPrimary">{u.name}</td>
                  <td className="p-3 text-textSecondary font-bold">{u.id}</td>
                  <td className="p-3 text-textSecondary font-semibold">{u.parentId || 'HQ'}</td>
                  <td className="p-3 text-textSecondary font-medium">{u.personnelCount} personnel</td>
                  <td className="p-3 text-textSecondary font-medium">{u.officerCount} officers</td>
                  <td className="p-3">
                    <span className="inline-flex items-center px-1.5 py-0.5 border rounded text-[9px] font-bold uppercase tracking-wider bg-success/10 text-success border-success/20">
                      {u.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Create Unit Modal (FR-24) */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create New Organizational Subunit"
        className="max-w-sm w-full font-sans"
      >
        <form onSubmit={handleCreateSubmit} className="space-y-4 font-sans text-left">
          <div className="space-y-1 text-xs">
            <label className="font-semibold text-textSecondary block">Subunit Name</label>
            <input
              type="text"
              required
              placeholder="e.g. Tactical Logistics"
              value={unitName}
              onChange={(e) => setUnitName(e.target.value)}
              className="w-full p-2.5 border border-border rounded bg-surface text-textPrimary text-xs focus:outline-none font-sans"
            />
          </div>

          <div className="space-y-1 text-xs">
            <label className="font-semibold text-textSecondary block">Unique Subunit ID</label>
            <input
              type="text"
              required
              placeholder="e.g. UNIT-12"
              value={unitId}
              onChange={(e) => setUnitId(e.target.value)}
              className="w-full p-2.5 border border-border rounded bg-surface text-textPrimary text-xs focus:outline-none font-sans"
            />
          </div>

          <div className="space-y-1 text-xs font-sans">
            <label className="font-semibold text-textSecondary block">Parent Organization Node</label>
            <select
              value={parentUnit}
              onChange={(e) => setParentUnit(e.target.value)}
              className="w-full p-2.5 border border-border rounded bg-surface text-textPrimary text-xs focus:outline-none font-sans font-semibold"
            >
              <option value="HQ-FORCE">HQ Command Section</option>
              <option value="UNIT-1">Unit 1 Support Section</option>
              <option value="UNIT-2">Unit 2 Logistics Section</option>
            </select>
          </div>

          <div className="flex gap-2 justify-end pt-2 border-t border-border mt-4 font-sans">
            <button
              type="button"
              onClick={() => setShowCreateModal(false)}
              disabled={isSubmitLoading}
              className="px-3.5 py-2 border border-border hover:bg-surfaceAlt text-textSecondary rounded text-xs font-semibold focus:outline-none"
            >
              Cancel
            </button>
            <Button type="submit" variant="primary" size="sm" isLoading={isSubmitLoading}>
              Create Unit
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
export default AdminUnitsPage;
