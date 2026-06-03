"use client";

import React from "react";

interface InfoRowProps {
  label: string;
  value: string;
  className?: string;
}

export default function InfoRow({ label, value, className = "" }: InfoRowProps) {
  return (
    <div
      className={`flex items-center justify-between py-3 px-4 rounded-xl bg-zinc-50/80 dark:bg-zinc-800/20 ${className}`}
    >
      <span className="text-[13px] font-medium text-zinc-500 dark:text-zinc-400">{label}</span>
      <span className="text-[13px] font-bold text-zinc-800 dark:text-zinc-100">{value}</span>
    </div>
  );
}
