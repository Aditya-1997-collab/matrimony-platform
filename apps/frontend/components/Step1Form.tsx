import React from 'react';
import { useOnboarding } from '../context/OnboardingContext';
import { ArrowRight } from 'lucide-react';

export const Step1Form = () => {
  const { data, updateData, setStep } = useOnboarding();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    updateData(Object.fromEntries(formData.entries()));
    setStep(2);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {data.profile_for && (
        <div className="bg-rose-50 border border-rose-100 rounded-xl p-3 mb-4 flex items-center justify-between">
          <span className="text-xs font-semibold text-rose-700">
            Creating profile for <span className="font-bold">{data.profile_for}</span>
          </span>
          <span className="text-xs font-semibold text-rose-700">
            Looking for <span className="font-bold">{data.looking_for}</span>
          </span>
        </div>
      )}
      <div>
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Full Name</label>
        <input
          name="full_name"
          placeholder="e.g. John Doe"
          defaultValue={data.full_name || ''}
          required
          className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent text-slate-800 placeholder-slate-400 font-medium text-sm transition-all"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Gender</label>
          <select
            name="gender"
            defaultValue={data.gender || 'male'}
            required
            className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent text-slate-800 font-medium text-sm transition-all bg-white"
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Date of Birth</label>
          <input
            name="date_of_birth"
            type="date"
            defaultValue={data.date_of_birth || ''}
            required
            className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent text-slate-800 font-medium text-sm transition-all bg-white"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Phone Number</label>
        <input
          name="phone"
          placeholder="+1 (555) 000-0000"
          defaultValue={data.phone || ''}
          required
          className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent text-slate-800 placeholder-slate-400 font-medium text-sm transition-all"
        />
      </div>

      <div className="pt-4">
        <button
          type="submit"
          className="w-full flex items-center justify-center gap-2 py-4 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 text-white font-bold rounded-xl shadow-lg shadow-rose-600/25 transition-all duration-200"
        >
          Next Step
          <ArrowRight className="h-5 w-5" />
        </button>
      </div>
    </form>
  );
};
