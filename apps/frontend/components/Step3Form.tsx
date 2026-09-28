import React from 'react';
import { useOnboarding } from '../context/OnboardingContext';
import { ArrowRight, ArrowLeft } from 'lucide-react';

export const Step3Form = () => {
  const { updateData, setStep } = useOnboarding();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    updateData(Object.fromEntries(formData.entries()));
    setStep(4);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Height (cm)</label>
          <input
            name="height_cm"
            type="number"
            placeholder="e.g. 175"
            className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent text-slate-800 placeholder-slate-400 font-medium text-sm transition-all"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Weight (kg)</label>
          <input
            name="weight_kg"
            type="number"
            placeholder="e.g. 70"
            className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent text-slate-800 placeholder-slate-400 font-medium text-sm transition-all"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Current City / Location</label>
        <input
          name="living_in"
          placeholder="e.g. New York, USA / Mumbai, India"
          className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent text-slate-800 placeholder-slate-400 font-medium text-sm transition-all"
        />
      </div>

      <div>
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">About Yourself (Bio)</label>
        <textarea
          name="bio"
          rows={4}
          placeholder="Write a few lines about your personality, hobbies, interests, and what you are looking for..."
          className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent text-slate-800 placeholder-slate-400 font-medium text-sm transition-all resize-none"
        />
      </div>

      <div className="flex items-center gap-4 pt-4">
        <button
          type="button"
          onClick={() => setStep(2)}
          className="w-1/3 flex items-center justify-center gap-2 py-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-all duration-200"
        >
          <ArrowLeft className="h-5 w-5" />
          Back
        </button>
        <button
          type="submit"
          className="w-2/3 flex items-center justify-center gap-2 py-4 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 text-white font-bold rounded-xl shadow-lg shadow-rose-600/25 transition-all duration-200"
        >
          Next Step
          <ArrowRight className="h-5 w-5" />
        </button>
      </div>
    </form>
  );
};
