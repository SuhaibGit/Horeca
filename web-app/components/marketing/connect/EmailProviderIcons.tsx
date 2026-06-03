"use client";

import React from "react";

export function GmailIcon() {
  return (
    <svg className="w-10 h-10" viewBox="0 0 48 48" aria-hidden>
      <path fill="#EA4335" d="M24 24L6 12v24l18-12z" />
      <path fill="#34A853" d="M42 12L24 24l18 12V12z" />
      <path fill="#FBBC05" d="M6 12l18 12 18-12H6z" />
      <path fill="#4285F4" d="M6 12h12v24H6V12zm30 0v12h12L42 12z" />
    </svg>
  );
}

export function OutlookIcon() {
  return (
    <svg className="w-10 h-10" viewBox="0 0 48 48" aria-hidden>
      <rect x="6" y="10" width="28" height="28" rx="4" fill="#0078D4" />
      <path fill="#fff" d="M12 18h16v3H12zm0 6h16v3H12zm0 6h10v3H12z" />
      <path fill="#28A8EA" d="M34 14h8v20h-8z" opacity="0.9" />
    </svg>
  );
}
