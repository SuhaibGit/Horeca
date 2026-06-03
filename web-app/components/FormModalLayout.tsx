"use client";

import React from "react";
import Modal from "./Modal";

interface FormModalLayoutProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  submitLabel: string;
  onSubmit: (e: React.FormEvent) => void;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg";
  maxWidthClass?: string;
  formClassName?: string;
}

export default function FormModalLayout({
  isOpen,
  onClose,
  title,
  submitLabel,
  onSubmit,
  children,
  size = "lg",
  maxWidthClass = "!max-w-[520px]",
  formClassName = "p-5",
}: FormModalLayoutProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size={size}
      showCloseButton={false}
      className={`${maxWidthClass} !rounded-2xl`}
    >
      <form onSubmit={onSubmit} className={formClassName}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[18px] font-bold text-zinc-900 dark:text-white">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {children}

        <div className="flex items-center justify-end gap-2.5 mt-3 pt-1">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-full border border-zinc-200 dark:border-zinc-700 text-[13px] font-bold text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2 rounded-full bg-linear-to-r from-[#041B40] to-[#0A46A6] hover:bg-[#12503C] text-white text-[13px] font-bold transition-colors cursor-pointer"
          >
            {submitLabel}
          </button>
        </div>
      </form>
    </Modal>
  );
}
