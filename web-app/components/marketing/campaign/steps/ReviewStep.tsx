"use client";

import React from "react";
import {
  estimateReach,
  getAudienceLabels,
} from "../../../../data/mockWhatsAppCampaigns";
import WhatsAppPreview from "../WhatsAppPreview";
import { CampaignCtaButton } from "../../../../data/mockWhatsAppCampaigns";

interface ReviewStepProps {
  name: string;
  audienceIds: string[];
  message: string;
  buttons: CampaignCtaButton[];
  businessName?: string;
}

export default function ReviewStep({
  name,
  audienceIds,
  message,
  buttons,
  businessName,
}: ReviewStepProps) {
  const audiences = getAudienceLabels(audienceIds);
  const reach = estimateReach(audienceIds);

  return (
    <div className="px-6 sm:px-8 py-4 max-h-[min(52vh,520px)] overflow-y-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        <div className="rounded-2xl bg-[#EBF7FF]  dark:bg-emerald-950/25 border border-emerald-100/80 dark:border-emerald-900/40 p-5 space-y-4">
          <h3 className="text-[15px] font-bold text-[#0A46A6] dark:text-[#28A388]">
            Campaign Details
          </h3>
          <div className="space-y-3 text-[13px]">
            <div className="flex justify-between gap-4">
              <span className="font-medium text-zinc-500 dark:text-zinc-400">Name</span>
              <span className="font-bold text-zinc-900 dark:text-white text-right">
                {name || "—"}
              </span>
            </div>
            <div className="flex justify-between gap-4 items-start">
              <span className="font-medium text-zinc-500 dark:text-zinc-400 shrink-0">Audience</span>
              <span className="font-bold text-zinc-900 dark:text-white text-right max-w-[60%]">
                {audiences.length ? audiences.join(", ") : "—"}
              </span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="font-medium text-zinc-500 dark:text-zinc-400">Estimated Reach</span>
              <span className="font-bold text-zinc-900 dark:text-white">
                {reach.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
        <WhatsAppPreview message={message} buttons={buttons} businessName={businessName} />
      </div>
    </div>
  );
}
