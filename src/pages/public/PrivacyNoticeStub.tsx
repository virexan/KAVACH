import React from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

export const PrivacyNoticeStub: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-background flex flex-col justify-center items-center p-6 select-none leading-relaxed">
      <div className="w-full max-w-2xl space-y-6">
        <Card className="p-6 md:p-8 space-y-4 bg-surface border border-border">
          <h1 className="text-xl font-bold text-textPrimary border-b border-border pb-3">
            KAVACH Welfare Portal - Privacy Notice
          </h1>
          <p className="text-sm text-textSecondary">
            This platform is operated securely. All wellness checks, workload evaluations, and stress analytics are collected under strict compliance frameworks.
          </p>
          <h2 className="text-sm font-semibold text-textPrimary pt-2">1. Scope of Collection</h2>
          <p className="text-sm text-textSecondary">
            Only workload parameters, operational indicators, and voluntary self-reported welfare inputs are collected. No unauthorized or non-professional metadata is aggregated.
          </p>
          <h2 className="text-sm font-semibold text-textPrimary pt-2">2. Access Controls</h2>
          <p className="text-sm text-textSecondary">
            Data is strictly separated by Role-Based Access controls, ensuring commanding officers only see aggregated statistics, while welfare officers receive actionable alerts.
          </p>
          <div className="border-t border-border pt-4 mt-6 flex justify-between items-center">
            <span className="text-xs text-textMuted font-medium">
              Privacy Shield v1.0.0
            </span>
            <Button variant="secondary" size="sm" onClick={() => navigate(-1)}>
              Go Back
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};
export default PrivacyNoticeStub;
