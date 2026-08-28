import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import consentService from '@/services/consentService';
import ConsentSection from '@/components/personnel/ConsentSection';
import ConsentToggle from '@/components/personnel/ConsentToggle';
import Skeleton from '@/components/ui/Skeleton';
import Card from '@/components/ui/Card';

export const ConsentPage: React.FC = () => {
  const queryClient = useQueryClient();

  const { data: consentRes, isLoading } = useQuery({
    queryKey: ['consent-status'],
    queryFn: () => consentService.getConsentStatus(),
  });

  const updateMutation = useMutation({
    mutationFn: ({ type, consent }: { type: 'WELLNESS' | 'BIOMETRIC'; consent: boolean }) =>
      consentService.updateConsent(type, consent),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['consent-status'] });
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton variant="line" className="h-8 w-1/4" />
        <Skeleton variant="card" className="h-48 w-full" />
      </div>
    );
  }

  const consents = consentRes?.data || [];
  const wellnessConsent = consents.find((c) => c.dataType === 'WELLNESS');
  const biometricConsent = consents.find((c) => c.dataType === 'BIOMETRIC');

  return (
    <div className="space-y-6 select-none max-w-3xl mx-auto">
      <div>
        <h1 className="text-xl font-black text-textPrimary leading-tight">Privacy & Consent</h1>
        <p className="text-xs text-textMuted mt-0.5">Manage your voluntary data sharing settings and wearable link options.</p>
      </div>

      <div className="space-y-4 font-sans">
        {/* Wellness Consent Toggle (FR-30) */}
        <ConsentToggle
          label="Wellness Survey Logs"
          description="Enables voluntary daily self-reports (Mood, Energy, Fatigue). Disabling this blocks check-in prompts."
          checked={!!wellnessConsent?.consent}
          onChange={(val) => updateMutation.mutate({ type: 'WELLNESS', consent: val })}
          statusText={wellnessConsent?.consent ? 'Consent Given' : 'Consent Revoked'}
          disabled={updateMutation.isPending}
        />

        {/* Biometric Wearable Consent Toggle (FR-31) */}
        <ConsentToggle
          label="Biometric Wearable Sync"
          description="Enables optional sync of sleep duration and heart rate variability (HRV) from base-provisioned wearables. Strictly optional."
          checked={!!biometricConsent?.consent}
          onChange={(val) => updateMutation.mutate({ type: 'BIOMETRIC', consent: val })}
          statusText={biometricConsent?.consent ? 'Device Sync Connected' : 'No Wearable Connected'}
          disabled={updateMutation.isPending}
        />
      </div>

      {/* Biometric device sync notice (FR-31) */}
      {biometricConsent?.consent && (
        <Card className="bg-primary/5 border border-primary/20 p-4 space-y-2 text-xs text-textSecondary animate-fadeIn select-none">
          <p className="font-bold text-primary">Demo Wearable Data</p>
          <p className="leading-relaxed">
            A mock wearable sync has been simulated. Heart rate variability (HRV) and activity index scores are gathered as synthetic demo signals only.
          </p>
        </Card>
      )}

      {/* General Policies (FR-30) */}
      <ConsentSection />
    </div>
  );
};
export default ConsentPage;
