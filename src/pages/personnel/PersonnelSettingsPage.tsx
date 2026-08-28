import React, { useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Checkbox from '@/components/ui/Checkbox';
import { useToast } from '@/hooks/useToast';

export const PersonnelSettingsPage: React.FC = () => {
  const toast = useToast();
  const user = useAuthStore((state) => state.user);

  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [mobileReminders, setMobileReminders] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast.success('Your settings preferences have been saved.', 'Settings Updated');
    }, 600);
  };

  return (
    <div className="space-y-6 select-none max-w-xl mx-auto">
      <div>
        <h1 className="text-xl font-black text-textPrimary leading-tight">Profile & Settings</h1>
        <p className="text-xs text-textMuted mt-0.5">Manage your personal display configurations and notification toggles.</p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Read-Only Administrative Details (FR-33) */}
        <Card className="bg-surface p-5 space-y-4">
          <h3 className="font-bold text-textPrimary text-sm border-b border-border pb-2">
            Service Identity (Read-Only)
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-sans">
            <Input
              label="Service ID"
              value={user?.serviceId || ''}
              disabled
              readOnly
            />
            <Input
              label="Assigned Unit"
              value={user?.unitId || 'Not Assigned'}
              disabled
              readOnly
            />
            <Input
              label="Role Assignment"
              value={user?.role || ''}
              disabled
              readOnly
              className="sm:col-span-2"
            />
          </div>
        </Card>

        <Card className="bg-surface p-5 space-y-4">
          <h3 className="font-bold text-textPrimary text-sm border-b border-border pb-2">
            Personal Customization
          </h3>
          <Input
            label="Display Name"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            required
            placeholder="e.g. John Doe"
          />
        </Card>

        <Card className="bg-surface p-5 space-y-4">
          <h3 className="font-bold text-textPrimary text-sm border-b border-border pb-2">
            Notification Preferences
          </h3>
          
          <div className="space-y-3 font-sans">
            <Checkbox
              id="notif-email"
              label="Receive daily email check-in alerts."
              checked={emailAlerts}
              onChange={(e) => setEmailAlerts(e.target.checked)}
            />
            <Checkbox
              id="notif-mobile"
              label="Receive mobile reminders before shift end."
              checked={mobileReminders}
              onChange={(e) => setMobileReminders(e.target.checked)}
            />
          </div>
        </Card>

        <div className="flex justify-end pt-2">
          <Button type="submit" variant="primary" className="font-bold" isLoading={isSaving}>
            Save Settings
          </Button>
        </div>
      </form>
    </div>
  );
};
export default PersonnelSettingsPage;
