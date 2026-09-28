"use client";

import React, { useEffect } from "react";
import { X } from "lucide-react";
import { createPortal } from "react-dom";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message: string;
  type?: "success" | "error" | "info" | "warning";
  showCloseButton?: boolean;
  children?: React.ReactNode;
}

export const Modal = ({
  isOpen,
  onClose,
  title,
  message,
  type = "info",
  showCloseButton = true,
  children,
}: ModalProps) => {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const typeStyles = {
    success: "bg-emerald-50 border-emerald-200 text-emerald-800",
    error: "bg-rose-50 border-rose-200 text-rose-800",
    info: "bg-blue-50 border-blue-200 text-blue-800",
    warning: "bg-amber-50 border-amber-200 text-amber-800",
  };

  const iconStyles = {
    success: "text-emerald-500",
    error: "text-rose-500",
    info: "text-blue-500",
    warning: "text-amber-500",
  };

  const icons = {
    success: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
    ),
    error: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
      </svg>
    ),
    info: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    warning: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    ),
  };

  const modalContent = (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className={`relative w-full max-w-md transform overflow-hidden rounded-2xl bg-white shadow-2xl transition-all ${typeStyles[type]} border`}>
          {/* Header */}
          <div className="flex items-start justify-between p-6 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-xl ${iconStyles[type]}/10`}>
                {icons[type]}
              </div>
              <div>
                {title && (
                  <h3 className="text-lg font-bold text-slate-900">{title}</h3>
                )}
              </div>
            </div>
            {showCloseButton && (
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                aria-label="Close modal"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>

          {/* Content */}
          <div className="p-6">
            {children ? (
              children
            ) : (
              <p className={`text-base ${typeStyles[type].replace("bg-", "text-").replace("border-", "")}`}>
                {message}
              </p>
            )}
          </div>

          {/* Footer - only if children not provided (simple message modal) */}
          {!children && (
            <div className="flex justify-end gap-3 p-6 border-t border-slate-100 bg-slate-50/50">
              <button
                onClick={onClose}
                className="px-4 py-2.5 text-sm font-semibold text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 transition-colors"
              >
                OK
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  // Render modal in portal to avoid z-index issues
  if (typeof window !== "undefined") {
    return createPortal(modalContent, document.body);
  }

  return null;
};

// Hook for easy modal management
export const useModal = () => {
  const [modalState, setModalState] = React.useState<{
    isOpen: boolean;
    title?: string;
    message: string;
    type?: "success" | "error" | "info" | "warning";
    onConfirm?: () => void;
    confirmText?: string;
  }>({
    isOpen: false,
    message: "",
  });

  const openModal = (config: {
    title?: string;
    message: string;
    type?: "success" | "error" | "info" | "warning";
    onConfirm?: () => void;
    confirmText?: string;
  }) => {
    setModalState({
      isOpen: true,
      ...config,
    });
  };

  const closeModal = () => {
    setModalState((prev) => ({ ...prev, isOpen: false }));
  };

  return {
    modalState,
    openModal,
    closeModal,
    Modal: () => (
      <Modal
        isOpen={modalState.isOpen}
        onClose={closeModal}
        title={modalState.title}
        message={modalState.message}
        type={modalState.type}
      />
    ),
  };
};

export default Modal;