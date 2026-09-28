'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { OnboardingProvider, useOnboarding } from '../../context/OnboardingContext';
import { OnboardingLayout } from '../../components/OnboardingLayout';
import { Step1Form } from '../../components/Step1Form';
import { Step2Form } from '../../components/Step2Form';
import { Step3Form } from '../../components/Step3Form';
import { Step4Form } from '../../components/Step4Form';

const OnboardingSteps = () => {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/signup");
    }
  }, [router]);
  const { step } = useOnboarding();

  return (
    <OnboardingLayout>
      {step === 1 && <Step1Form />}
      {step === 2 && <Step2Form />}
      {step === 3 && <Step3Form />}
      {step === 4 && <Step4Form />}
    </OnboardingLayout>
  );
};

export default function OnboardingPage() {
  return (
    <OnboardingProvider>
      <OnboardingSteps />
    </OnboardingProvider>
  );
}
