import React, { useState } from 'react';
import { useOnboarding } from '../context/OnboardingContext';
import { ArrowLeft, Check, Upload, Image as ImageIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Modal } from '@/components/Modal';

export const Step4Form = () => {
  const { data, setStep } = useOnboarding();
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const router = useRouter();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const token = typeof window !== 'undefined' ? localStorage.getItem("token") : null;
    if (!token) {
      setError("You are not authenticated. Please sign in or register first.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/onboarding/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(data)
      });

      const resData = await response.json();
      if (!response.ok) {
        throw new Error(resData.error || "Failed to save profile details");
      }

      // Show success modal
      setShowSuccessModal(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleModalClose = () => {
    setShowSuccessModal(false);
    router.push("/");
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-rose-50 border border-rose-100 text-rose-700 px-4 py-3 rounded-xl text-sm font-medium">
            {error}
          </div>
        )}

        <div className="text-center">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-4">Upload Profile Photo</label>
          
          <div className="relative mx-auto w-40 h-40 group">
            <div className="w-full h-full rounded-3xl border-2 border-dashed border-slate-300 bg-slate-50 flex flex-col items-center justify-center overflow-hidden transition-all group-hover:border-rose-400 group-hover:bg-rose-50">
              {preview ? (
                <img src={preview} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <>
                  <ImageIcon className="h-10 w-10 text-slate-400 mb-2 group-hover:text-rose-500" />
                  <span className="text-[10px] font-bold text-slate-500 uppercase group-hover:text-rose-600">Select Image</span>
                </>
              )}
            </div>
            <input
              type="file"
              name="photo"
              accept="image/*"
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <div className="absolute -bottom-2 -right-2 bg-rose-600 text-white p-2 rounded-xl shadow-lg">
              <Upload className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-4 text-xs text-slate-500">
            A good photo increases your chances of finding a match by 10x!
          </p>
        </div>

        <div className="bg-rose-50 p-4 rounded-2xl border border-rose-100">
          <h4 className="text-sm font-bold text-rose-800 mb-2 flex items-center gap-2">
            <Check className="h-4 w-4" /> Almost there!
          </h4>
          <p className="text-xs text-rose-700 leading-relaxed">
            By clicking complete, you agree to our terms and conditions. Your profile will be reviewed by our team within 24 hours.
          </p>
        </div>

        <div className="flex items-center gap-4 pt-2">
          <button
            type="button"
            onClick={() => setStep(3)}
            className="w-1/3 flex items-center justify-center gap-2 py-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-all duration-200"
          >
            <ArrowLeft className="h-5 w-5" />
            Back
          </button>
          <button
            type="submit"
            disabled={loading}
            className="w-2/3 flex items-center justify-center gap-2 py-4 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 text-white font-bold rounded-xl shadow-lg shadow-rose-600/25 transition-all duration-200 disabled:opacity-50"
          >
            {loading ? "Saving..." : "Complete Registration"}
            {!loading && <Check className="h-5 w-5" />}
          </button>
        </div>
      </form>

      {/* Success Modal */}
      <Modal
        isOpen={showSuccessModal}
        onClose={handleModalClose}
        title="Profile Created Successfully!"
        message="Your soulmate profile has been created. Start exploring compatible matches now!"
        type="success"
        showCloseButton={false}
      />
    </>
  );
};
