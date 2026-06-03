"use client";

import React from "react";
import { StockHistoryEntry, getStockHistoryLabel } from "../../data/mockInventory";

interface StockHistoryTimelineProps {
  entries: StockHistoryEntry[];
  className?: string;
}

export default function StockHistoryTimeline({
  entries,
  className = "",
}: StockHistoryTimelineProps) {
  if (entries.length === 0) {
    return (
      <p className="text-center py-8 text-[13px] font-medium text-zinc-400">
        No stock history recorded yet.
      </p>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {entries.map((entry, index) => {
        const isLast = index === entries.length - 1;
        return (
          <div key={entry.id} className="relative flex gap-3 pb-6 last:pb-0">
            {!isLast && (
              <span
                className="absolute left-[15px] top-8 bottom-0 w-px bg-zinc-200 dark:bg-zinc-700"
                aria-hidden
              />
            )}
            <div className="w-8 h-8 rounded-full bg-linear-to-r from-[#041B40] to-[#0A46A6] flex items-center justify-center shrink-0 z-10">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div className="pt-0.5 min-w-0">
              <p className="text-[14px] font-bold text-zinc-900 dark:text-white">
                {getStockHistoryLabel(entry)}
              </p>
              <p className="text-[12px] font-medium text-zinc-400 mt-0.5">
                {entry.date} • {entry.source}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
