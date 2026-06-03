"use client";

import React from "react";
import Modal from "./Modal";

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "danger" | "primary";
  icon?: React.ReactNode;
}

function TrashIcon() {
  return (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.75}
        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
      />
    </svg>
  );
}

export default function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "primary",
  icon,
}: ConfirmDialogProps) {
  const confirmClass =
    variant === "danger"
      ? "bg-[#E25C5C] hover:bg-[#D14B4B] text-white"
      : "bg-linear-to-r from-[#041B40] to-[#0A46A6] hover:bg-[#12503C] text-white";

  const defaultIcon =
    variant === "danger" ? (
      <div className="w-12 h-12 rounded-full bg-red-50 dark:bg-red-950/30 text-[#E25C5C] flex items-center justify-center shrink-0">
        <TrashIcon />
      </div>
    ) : (
      <div className="w-12 h-12 rounded-full bg-emerald-50 dark:bg-emerald-950/30 text-[#0A46A6] flex items-center justify-center shrink-0">
        <TrashIcon />
      </div>
    );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="sm"
      showCloseButton={false}
      className="!max-w-[420px] !rounded-2xl"
    >
      <div className="p-6">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3.5 min-w-0 flex-1">
            {icon ?? defaultIcon}
            <div className="space-y-1.5 min-w-0 pt-0.5">
              <h3 className="text-[16px] font-bold text-zinc-900 dark:text-white leading-tight">
                {title}
              </h3>
              <p className="text-[13px] font-medium text-zinc-500 dark:text-zinc-400 leading-relaxed">
                {description}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors cursor-pointer shrink-0"
            aria-label="Close"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex items-center justify-end gap-2.5 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 rounded-full border border-zinc-200 dark:border-zinc-700 text-[13px] font-bold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`px-6 py-2 rounded-full text-[13px] font-bold transition-colors cursor-pointer shadow-sm ${confirmClass}`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </Modal>
  );
}
