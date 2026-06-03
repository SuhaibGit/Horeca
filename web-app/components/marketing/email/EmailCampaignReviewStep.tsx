"use client";

import React from "react";
import {
  EmailBlock,
  EmailBuilderSettings,
  estimateReach,
  getAudienceLabels,
} from "../../../data/mockEmailCampaigns";
import EmailCampaignPreview from "./EmailCampaignPreview";

interface EmailCampaignReviewStepProps {
  name: string;
  subject: string;
  audienceIds: string[];
  blocks: EmailBlock[];
  settings: EmailBuilderSettings;
  detailsTitle?: string;
  entityLabel?: string;
}

export default function EmailCampaignReviewStep({
  name,
  subject,
  audienceIds,
  blocks,
  settings,
  detailsTitle = "Campaign Details",
  entityLabel = "Campaign",
}: EmailCampaignReviewStepProps) {
  const audience = getAudienceLabels(audienceIds).join(", ");

  return (
    <div className="px-6 sm:px-8 py-4  overflow-hidden space-y-6 ">
      <div className="rounded-2xl border border-emerald-100 dark:border-emerald-900/40 bg-[#EBF7FF]  dark:bg-emerald-950/20 p-5 space-y-3 max-w-xl ">
        <h3 className="text-[14px] font-bold text-[#0A46A6] dark:text-[#28A388]">{detailsTitle}</h3>
        <div className="space-y-2 text-[13px]">
          <div className="flex justify-between gap-4">
            <span className="font-medium text-zinc-500">Name</span>
            <span className="font-bold text-zinc-900 dark:text-white text-right">
              {name || `Untitled ${entityLabel}`}
            </span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="font-medium text-zinc-500">Audience</span>
            <span className="font-bold text-zinc-900 dark:text-white text-right">{audience || "—"}</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="font-medium text-zinc-500">Estimated Reach</span>
            <span className="font-bold text-zinc-900 dark:text-white">
              {estimateReach(audienceIds).toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-[14px] font-bold text-zinc-800 dark:text-zinc-100 mb-3 text-center">
          Email Preview
        </h3>
        <EmailCampaignPreview subject={subject} blocks={blocks} settings={settings} />
      </div>
    </div>
  );
}
