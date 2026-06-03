"use client";

import React, { useEffect, useState } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl" | "6xl" | "7xl" | "full";
  showCloseButton?: boolean;
  closeOnOverlayClick?: boolean;
  className?: string;
  /** e.g. z-[70] when opening above a z-50 drawer */
  wrapperClassName?: string;
}

export default function Modal({
  isOpen,
  onClose,
  children,
  size = "md",
  showCloseButton = true,
  closeOnOverlayClick = true,
  className = "",
  wrapperClassName = "",
}: ModalProps) {
  const [mounted, setMounted] = useState(false);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setMounted(true);
      // Small timeout to trigger CSS transition after mounting
      const timer = setTimeout(() => setAnimate(true), 10);
      // Prevent body scrolling when modal is open
      document.body.style.overflow = "hidden";
      return () => {
        clearTimeout(timer);
      };
    } else {
      setAnimate(false);
      // Wait for exit transition to finish before unmounting
      const timer = setTimeout(() => setMounted(false), 300);
      document.body.style.overflow = "unset";
      return () => {
        clearTimeout(timer);
      };
    }
  }, [isOpen]);

  // Clean up overflow style on unmount
  useEffect(() => {
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  if (!mounted) return null;

  // Determine size classes
  const sizeClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    "2xl": "max-w-2xl",
    "3xl": "max-w-3xl",
    "4xl": "max-w-4xl",
    "5xl": "max-w-5xl",
    "6xl": "max-w-6xl",
    "7xl": "max-w-7xl",
    full: "max-w-[95vw] md:max-w-[90vw] lg:max-w-[85vw] xl:max-w-[1200px]",
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (closeOnOverlayClick && e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-x-hidden overflow-y-auto scrollbar-hide ${wrapperClassName}`}
    >
      {/* Backdrop overlay */}
      <div
        className={`fixed inset-0 bg-black/40 backdrop-blur-md transition-opacity duration-300 ease-out ${animate ? "opacity-100" : "opacity-0"
          }`}
        onClick={handleOverlayClick}
        aria-hidden="true"
      />

      {/* Modal Container */}
      <div
        className={`relative w-full max-h-[calc(100dvh-2rem)] my-auto flex flex-col bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl overflow-hidden border border-zinc-100 dark:border-zinc-800 transition-all duration-300 ease-out transform ${animate
          ? "opacity-100 translate-y-0 scale-100"
          : "opacity-0 translate-y-8 scale-95"
          } ${sizeClasses[size]} ${className}`}
        role="dialog"
        aria-modal="true"
      >
        {/* Close Button */}
        {showCloseButton && (
          <button
            onClick={onClose}
            className="absolute top-5 right-5 z-10 p-2 text-zinc-400 hover:text-zinc-600 cursor-pointer backdrop-blur-sm rounded-full transition-all duration-200 mt-1.5 focus:outline-none focus:ring-2 focus:ring-teal-600"
            aria-label="Close modal"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}

        {/* Modal Content */}
        <div className="w-full min-h-0 overflow-y-auto overflow-x-hidden scrollbar-hide">{children}</div>
      </div>
    </div>
  );
}
