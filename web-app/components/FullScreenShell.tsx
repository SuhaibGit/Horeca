"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";

interface FullScreenShellProps {
  children: React.ReactNode;
  className?: string;
}

/** Covers the entire viewport (sidebar, header, and main) via a body portal. */
export default function FullScreenShell({ children, className = "" }: FullScreenShellProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  if (!mounted) return null;

  return createPortal(
    <div
      className={`fixed inset-0 z-[100] flex flex-col bg-zinc-50 dark:bg-zinc-950 overflow-hidden ${className}`}
      role="dialog"
      aria-modal="true"
    >
      {children}
    </div>,
    document.body
  );
}
