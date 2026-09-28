import React from 'react';
import { useOnboarding } from '../context/OnboardingContext';
import { Heart } from 'lucide-react';

export const OnboardingLayout = ({ children }: { children: React.ReactNode }) => {
  const { step } = useOnboarding();

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-pink-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-rose-500 to-pink-500 flex items-center justify-center text-white shadow-lg shadow-rose-500/30">
            <Heart className="h-7 w-7 fill-current" />
          </div>
        </div>
        <h2 className="mt-4 text-center text-3xl font-extrabold text-slate-900 tracking-tight">
          Create Your SoulMate Profile
        </h2>
        <p className="mt-2 text-center text-sm text-slate-600">
          Step {step} of 4 — {step === 1 ? 'Account Credentials' : step === 2 ? 'Basic & Professional Details' : step === 3 ? 'Lifestyle & About You' : 'Profile Picture'}
        </p>

        {/* Progress Bar */}
        <div className="mt-6 w-full bg-slate-200 h-2 rounded-full overflow-hidden">
          <div
            className="bg-gradient-to-r from-rose-500 to-pink-500 h-full transition-all duration-300 rounded-full"
            style={{ width: `${(step / 4) * 100}%` }}
          ></div>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-xl px-4">
        <div className="bg-white py-8 px-6 shadow-2xl shadow-rose-500/10 rounded-3xl border border-rose-100 sm:px-10">
          {children}
        </div>
      </div>
    </div>
  );
};
