"use client";

import React, { useEffect } from "react";

interface ToastProps {
  message: string;
  isVisible: boolean;
  onClose: () => void;
  durationMs?: number;
}

export default function Toast({ message, isVisible, onClose, durationMs = 4000 }: ToastProps) {
  useEffect(() => {
    if (!isVisible) return;
    const t = setTimeout(onClose, durationMs);
    return () => clearTimeout(t);
  }, [isVisible, onClose, durationMs]);

  if (!isVisible) return null;

  return (
    <div
      className="fixed top-20 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-2.5 px-5 py-3 rounded-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 shadow-lg animate-fade-in"
      role="status"
    >
      <span className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-950/50 text-[#0A46A6] flex items-center justify-center shrink-0">
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
        </svg>
      </span>
      <span className="text-[13px] font-bold text-zinc-800 dark:text-zinc-100 whitespace-nowrap">
        {message}
      </span>
    </div>
  );
}
