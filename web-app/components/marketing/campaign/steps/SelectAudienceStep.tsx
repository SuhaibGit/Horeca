"use client";

import React from "react";
import { AUDIENCE_SEGMENTS } from "../../../../data/mockWhatsAppCampaigns";
import AudienceSegmentIcon from "../AudienceSegmentIcon";

interface SelectAudienceStepProps {
  selectedIds: string[];
  onToggle: (id: string) => void;
}

export default function SelectAudienceStep({ selectedIds, onToggle }: SelectAudienceStepProps) {
  return (
    <div className="px-6 sm:px-8 py-4 max-h-[min(52vh,520px)] overflow-hidden">
      <h3 className="text-[15px] font-bold text-zinc-800 dark:text-zinc-100 mb-4">
        Select Audience Segment
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 ">
        {AUDIENCE_SEGMENTS.map((seg) => {
          const selected = selectedIds.includes(seg.id);
          return (
            <button
              key={seg.id}
              type="button"
              onClick={() => onToggle(seg.id)}
              className={`text-left p-4 rounded-2xl border-2 transition-all cursor-pointer ${selected
                ? "border-[#0A46A6] bg-[#EBF7FF]  dark:bg-emerald-950/30"
                : "border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-zinc-200"
                }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${selected
                    ? "bg-[#0A46A6]/10 text-[#0A46A6]"
                    : "bg-zinc-100 dark:bg-zinc-800 text-zinc-500"
                    }`}
                >
                  <AudienceSegmentIcon icon={seg.icon} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[14px] font-bold text-zinc-900 dark:text-white">{seg.title}</p>
                  <p className="text-[12px] font-medium text-zinc-500 dark:text-zinc-400 mt-0.5 leading-snug">
                    {seg.description}
                  </p>
                  <p className="flex items-center gap-1.5 text-[11px] font-semibold text-zinc-400 mt-2">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    {seg.customerCount.toLocaleString()} customers
                  </p>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
