"use client";

import React from "react";

export interface PageTab<T extends string> {
  id: T;
  label: string;
}

interface PageTabsProps<T extends string> {
  tabs: PageTab<T>[];
  active: T;
  onChange: (id: T) => void;
  className?: string;
}

export default function PageTabs<T extends string>({
  tabs,
  active,
  onChange,
  className = "",
}: PageTabsProps<T>) {
  return (
    <div className={`flex items-center gap-8 border-b border-zinc-200 dark:border-zinc-800 ${className}`}>
      {tabs.map((tab) => {
        const isActive = active === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            className={`pb-3 text-[14px] font-bold transition-colors cursor-pointer relative ${isActive
              ? "text-zinc-900 dark:text-white"
              : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300"
              }`}
          >
            {tab.label}
            {isActive && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-linear-to-r from-[#041B40] to-[#0A46A6] rounded-full" />
            )}
          </button>
        );
      })}
    </div>
  );
}
