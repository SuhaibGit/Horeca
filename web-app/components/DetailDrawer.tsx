"use client";

import React, { useEffect, useId } from "react";

export interface DetailDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: React.ReactNode;
  titleClassName?: string;
  badge?: React.ReactNode;
  headerActions?: React.ReactNode;
  footer?: React.ReactNode;
  children: React.ReactNode;
  maxWidthClass?: string;
  panelClassName?: string;
  outerClassName?: string;
  contentClassName?: string;
  headerClassName?: string;
}

export default function DetailDrawer({
  isOpen,
  onClose,
  title,
  titleClassName = "text-[18px] font-bold text-zinc-900 dark:text-white tracking-tight",
  badge,
  headerActions,
  footer,
  children,
  maxWidthClass = "max-w-[480px]",
  panelClassName = "",
  outerClassName = "",
  contentClassName = "p-6 space-y-6",
  headerClassName = "p-6",
}: DetailDrawerProps) {
  const titleId = useId();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className={`fixed inset-0 z-50 p-3 rounded-[20px] flex justify-end  ${outerClassName}`}>
      <div
        onClick={onClose}
        className="fixed inset-0 bg-[#092219]/40  backdrop-blur-xs transition-opacity duration-300 animate-fade-in cursor-pointer"
        aria-hidden
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={`relative w-full ${maxWidthClass} h-full rounded-[20px] bg-white dark:bg-zinc-900 shadow-2xl flex flex-col z-10 animate-slide-in-right border-l border-zinc-100 dark:border-zinc-800 ${panelClassName}`}
      >
        <div
          className={`${headerClassName} border-b border-zinc-100 dark:border-zinc-800/60 flex items-center justify-between shrink-0`}
        >
          <div className="flex items-center gap-3 min-w-0">
            <h2 id={titleId} className={titleClassName}>
              {title}
            </h2>
            {badge}
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {headerActions}
            <button
              type="button"
              onClick={onClose}
              className="p-1 rounded-full text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors cursor-pointer"
              aria-label="Close"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className={`flex-1 min-h-0 overflow-y-auto overflow-x-hidden dashboard-scroll-container scrollbar-hide ${contentClassName}`}>
          {children}
        </div>

        {footer ? (
          <div className="shrink-0 p-6  dark:border-zinc-800/60">{footer}</div>
        ) : null}
      </div>
    </div>
  );
}