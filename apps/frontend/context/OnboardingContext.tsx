'use client';

import React, { createContext, useContext, useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

interface OnboardingContextType {
  data: any;
  updateData: (newData: any) => void;
  step: number;
  setStep: React.Dispatch<React.SetStateAction<number>>;
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

const OnboardingProviderInner = ({ children }: { children: React.ReactNode }) => {
  const searchParams = useSearchParams();
  const [data, setData] = useState<any>({});
  const [step, setStep] = useState(1);

  useEffect(() => {
    const profileFor = searchParams.get('profileFor');
    const lookingFor = searchParams.get('lookingFor');
    
    if (profileFor || lookingFor) {
      setData((prev: any) => ({
        ...prev,
        profile_for: profileFor || prev.profile_for,
        looking_for: lookingFor || prev.looking_for,
      }));
    }
  }, [searchParams]);

  const updateData = (newData: any) => {
    setData((prev: any) => ({ ...prev, ...newData }));
  };

  return (
    <OnboardingContext.Provider value={{ data, updateData, step, setStep }}>
      {children}
    </OnboardingContext.Provider>
  );
};

export const OnboardingProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <OnboardingProviderInner>
        {children}
      </OnboardingProviderInner>
    </Suspense>
  );
};

export const useOnboarding = () => {
  const context = useContext(OnboardingContext);
  if (context === undefined) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  return context;
};
