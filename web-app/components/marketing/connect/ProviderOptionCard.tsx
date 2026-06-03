"use client";

import React from "react";

interface ProviderOptionCardProps {
  selected: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  title: string;
  description: string;
}

export default function ProviderOptionCard({
  selected,
  onClick,
  icon,
  title,
  description,
}: ProviderOptionCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full flex items-start gap-4 p-4 rounded-2xl border text-left transition-all cursor-pointer ${selected
        ? "border-[#0A46A6]/40 bg-[#EBF7FF] /60 dark:bg-emerald-950/20 ring-1 ring-[#0A46A6]/20"
        : "border-zinc-100 dark:border-zinc-800 bg-zinc-50/80 dark:bg-zinc-800/30 hover:border-zinc-200 dark:hover:border-zinc-700"
        }`}
    >
      <div className="w-10 h-10 shrink-0 flex items-center justify-center">{icon}</div>
      <div className="min-w-0 space-y-0.5">
        <p className="text-[15px] font-bold text-zinc-900 dark:text-white">{title}</p>
        <p className="text-[12px] font-medium text-zinc-500 dark:text-zinc-400 leading-relaxed max-w-[325px]">
          {description}
        </p>
      </div>
    </button>
  );
}
