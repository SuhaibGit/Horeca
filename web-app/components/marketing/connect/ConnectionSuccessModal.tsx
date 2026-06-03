"use client";

import React from "react";
import Modal from "../../Modal";

interface ConnectionSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: React.ReactNode;
  actionLabel?: string;
}

export default function ConnectionSuccessModal({
  isOpen,
  onClose,
  title,
  description,
  actionLabel = "Go To Dashboard",
}: ConnectionSuccessModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl" className="!rounded-[24px]">
      <div className="p-6 ">
        <div className="flex items-start justify-between gap-3">
          <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950/50 flex items-center justify-center text-[#0A46A6] shrink-0">
            <svg className="w-6 h-6" fill="none" stroke="#21AB70" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div>
            <h2 className="text-[20px] font-bold text-zinc-900 dark:text-white tracking-tight">{title}</h2>
            <div className="text-[14px] font-medium text-zinc-500 dark:text-zinc-400 mt-2 leading-relaxed">
              {description}
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>



        <div className="flex justify-end pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-5.5 py-2 rounded-full bg-linear-to-r from-[#041B40] to-[#0A46A6] hover:bg-[#12503C] text-white text-[16px] font-bold cursor-pointer transition-all"
          >
            {actionLabel}
          </button>
        </div>
      </div>
    </Modal>
  );
}
