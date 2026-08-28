import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import wellnessService from '@/services/wellnessService';
import CheckInProgress from '@/components/personnel/CheckInProgress';
import CheckInQuestion from '@/components/personnel/CheckInQuestion';
import CheckInReview from '@/components/personnel/CheckInReview';
import CheckInSuccess from '@/components/personnel/CheckInSuccess';

export const DailyCheckInPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [currentStep, setCurrentStep] = useState(0); // Steps: 0-4 questions, 5 review, 6 success

  const [answers, setAnswers] = useState({
    mood: null as number | null,
    energy: null as number | null,
    stress: null as number | null,
    fatigue: null as number | null,
    sleep: null as number | null,
  });

  const [notes, setNotes] = useState('');
  const [submitError, setSubmitError] = useState<string | null>(null);

  const submitMutation = useMutation({
    mutationFn: () =>
      wellnessService.submitCheckIn({
        moodScore: answers.mood!,
        energyScore: answers.energy!,
        stressScore: answers.stress!,
        fatigueScore: answers.fatigue!,
        sleepScore: answers.sleep!,
        notes: notes.trim() || undefined,
        consentVersion: 'v1.2',
      }),
    onSuccess: () => {
      // Invalidate queries to refresh dashboard/history data instantly (FR-20)
      queryClient.invalidateQueries({ queryKey: ['wellness-summary'] });
      queryClient.invalidateQueries({ queryKey: ['wellness-history'] });
      queryClient.invalidateQueries({ queryKey: ['wellness-trends'] });
      setCurrentStep(6);
    },
    onError: () => {
      setSubmitError('We could not save your check-in. Please verify connection and try again.');
    },
  });

  const handleSelectAnswer = (dimension: keyof typeof answers, value: number) => {
    setAnswers((prev) => ({ ...prev, [dimension]: value }));
  };

  const handleNext = () => {
    setCurrentStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(0, prev - 1));
  };

  const handleEditStep = (stepIdx: number) => {
    setCurrentStep(stepIdx);
  };

  const handleSubmit = () => {
    setSubmitError(null);
    submitMutation.mutate();
  };

  const steps = [
    {
      dim: 'mood' as const,
      title: 'How have you been feeling today?',
      desc: 'Reflect on your overall mood and emotional state.',
      options: [
        { label: 'Very low', value: 1, icon: '😟' },
        { label: 'Low', value: 2, icon: '🙁' },
        { label: 'Okay', value: 3, icon: '😐' },
        { label: 'Good', value: 4, icon: '🙂' },
        { label: 'Very good', value: 5, icon: '😊' },
      ],
    },
    {
      dim: 'energy' as const,
      title: 'How is your energy today?',
      desc: 'Reflect on your stamina and physical energy levels.',
      options: [
        { label: 'Very low', value: 1 },
        { label: 'Low', value: 2 },
        { label: 'Moderate', value: 3 },
        { label: 'Good', value: 4 },
        { label: 'High', value: 5 },
      ],
    },
    {
      dim: 'stress' as const,
      title: 'How stressed have you felt today?',
      desc: 'Reflect on any pressures or tension you might be feeling.',
      options: [
        { label: 'Very low', value: 1 },
        { label: 'Low', value: 2 },
        { label: 'Moderate', value: 3 },
        { label: 'High', value: 4 },
        { label: 'Very high', value: 5 },
      ],
    },
    {
      dim: 'fatigue' as const,
      title: 'How physically or mentally tired do you feel?',
      desc: 'Reflect on your level of exhaustion.',
      options: [
        { label: 'Very low', value: 1 },
        { label: 'Low', value: 2 },
        { label: 'Moderate', value: 3 },
        { label: 'High', value: 4 },
        { label: 'Very high', value: 5 },
      ],
    },
    {
      dim: 'sleep' as const,
      title: 'How would you rate your sleep recently?',
      desc: 'Reflect on rest cycles and sleep depth quality.',
      options: [
        { label: 'Very poor', value: 1, icon: '🛌' },
        { label: 'Poor', value: 2, icon: '🛌' },
        { label: 'Okay', value: 3, icon: '🛌' },
        { label: 'Good', value: 4, icon: '🛌' },
        { label: 'Very good', value: 5, icon: '🛌' },
      ],
    },
  ];

  const totalSteps = steps.length + 1; // 5 questions + 1 review step

  return (
    <div className="max-w-xl mx-auto space-y-6 select-none">
      {currentStep < 6 && (
        <div className="space-y-4 animate-fadeIn">
          <h1 className="text-xl font-black text-textPrimary leading-tight">Daily Wellness Check-In</h1>
          <CheckInProgress currentStep={currentStep + 1} totalSteps={totalSteps} />
        </div>
      )}

      {currentStep < 5 && (
        <CheckInQuestion
          questionTitle={steps[currentStep].title}
          questionDescription={steps[currentStep].desc}
          options={steps[currentStep].options}
          selectedValue={answers[steps[currentStep].dim]}
          onSelect={(val) => handleSelectAnswer(steps[currentStep].dim, val)}
          onNext={handleNext}
          onBack={handleBack}
          isFirst={currentStep === 0}
        />
      )}

      {currentStep === 5 && (
        <CheckInReview
          answers={{
            mood: answers.mood!,
            energy: answers.energy!,
            stress: answers.stress!,
            fatigue: answers.fatigue!,
            sleep: answers.sleep!,
          }}
          notes={notes}
          setNotes={setNotes}
          onEditStep={handleEditStep}
          onSubmit={handleSubmit}
          onBack={handleBack}
          isLoading={submitMutation.isPending}
          error={submitError}
        />
      )}

      {currentStep === 6 && <CheckInSuccess />}
    </div>
  );
};
export default DailyCheckInPage;
