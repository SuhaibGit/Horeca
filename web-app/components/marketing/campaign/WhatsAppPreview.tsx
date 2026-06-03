"use client";

import React from "react";
import { CampaignCtaButton } from "../../../data/mockWhatsAppCampaigns";

interface WhatsAppPreviewProps {
  message: string;
  buttons: CampaignCtaButton[];
  businessName?: string;
}

export default function WhatsAppPreview({
  message,
  buttons,
  businessName = "HORECA",
}: WhatsAppPreviewProps) {
  const activeButtons = buttons.filter((b) => b.label.trim());

  return (
    <div className="flex flex-col items-center">
      <p className="text-[13px] font-bold text-zinc-700 dark:text-zinc-200 mb-4">WhatsApp Preview</p>
      <div className="w-[240px] rounded-[32px] border-[6px] border-zinc-800 bg-zinc-800 shadow-xl overflow-hidden">
        <div className="bg-[#075E54] px-3 py-2 flex items-center gap-2">
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center text-white text-[10px] font-bold">
            H
          </div>
          <span className="text-white text-[12px] font-bold truncate">{businessName}</span>
        </div>
        <div className="bg-[#ECE5DD] dark:bg-zinc-700 p-3 min-h-[280px]">
          <div className="bg-white dark:bg-zinc-100 rounded-lg overflow-hidden shadow-sm max-w-[200px]">
            <div className="h-24 bg-linear-to-br from-[#0A46A6] to-[#28A388] flex flex-col items-center justify-center p-2 text-center">
              <span className="text-[8px] font-black text-white uppercase leading-tight">
                Exclusive Restaurant Deal
              </span>
              <span className="text-[10px] font-bold text-white mt-1">20% OFF ENTIRE MEAL</span>
            </div>
            <div className="p-2.5">
              <p className="text-[10px] leading-snug text-zinc-800">
                {message.trim() ||
                  "Craving something delicious? Enjoy our exclusive restaurant deal today!"}
              </p>
              <p className="text-[9px] text-zinc-400 text-right mt-1">08:21</p>
            </div>
            {activeButtons.map((btn) => (
              <button
                key={btn.id}
                type="button"
                className="w-full py-2 text-[11px] font-semibold text-[#0088cc] border-t border-zinc-100 text-center"
              >
                {btn.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
