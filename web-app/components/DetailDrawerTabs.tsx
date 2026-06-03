"use client";

import React from "react";

export interface DetailDrawerTab<T extends string> {
  id: T;
  label: string;
}

interface DetailDrawerTabsProps<T extends string> {
  tabs: DetailDrawerTab<T>[];
  active: T;
  onChange: (id: T) => void;
}

export default function DetailDrawerTabs<T extends string>({
  tabs,
  active,
  onChange,
}: DetailDrawerTabsProps<T>) {
  return (
    <div className="flex p-1 bg-zinc-100 dark:bg-zinc-800/50 rounded-xl">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          onClick={() => onChange(tab.id)}
          className={`flex-1 py-2.5 text-[13px] font-bold rounded-lg transition-all cursor-pointer ${active === tab.id
            ? "bg-linear-to-r from-[#041B40] to-[#0A46A6] text-white shadow-sm"
            : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-700"
            }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
