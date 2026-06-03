"use client";

import React from "react";

interface ScheduleStepProps {
  scheduleDate: string;
  scheduleTime: string;
  onDateChange: (v: string) => void;
  onTimeChange: (v: string) => void;
}

export default function ScheduleStep({
  scheduleDate,
  scheduleTime,
  onDateChange,
  onTimeChange,
}: ScheduleStepProps) {
  return (
    <div className="px-6 sm:px-8 py-6 max-h-[min(52vh,520px)] overflow-y-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-2xl">
        <div>
          <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 block mb-1.5">
            Date
          </label>
          <div className="relative">
            <input
              type="date"
              value={scheduleDate}
              onChange={(e) => onDateChange(e.target.value)}
              className="w-full px-4 py-3.5 pr-10 bg-[#f4f5f6] dark:bg-zinc-800/40 border border-zinc-100 dark:border-zinc-800 rounded-xl text-[13px] font-medium text-zinc-800 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#0A46A6]/50"
            />
            <svg
              className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400 pointer-events-none"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        </div>
        <div>
          <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 block mb-1.5">
            Time
          </label>
          <div className="relative">
            <input
              type="time"
              value={scheduleTime}
              onChange={(e) => onTimeChange(e.target.value)}
              className="w-full px-4 py-3.5 pr-10 bg-[#f4f5f6] dark:bg-zinc-800/40 border border-zinc-100 dark:border-zinc-800 rounded-xl text-[13px] font-medium text-zinc-800 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#0A46A6]/50"
            />
            <svg
              className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400 pointer-events-none"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
