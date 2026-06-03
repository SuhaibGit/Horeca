"use client";

import React, { useState } from "react";
import DetailDrawer from "../../DetailDrawer";
import DetailDrawerTabs from "../../DetailDrawerTabs";
import { EmailCampaign, EmailCampaignStatus, getAudienceLabels } from "../../../data/mockEmailCampaigns";
import EmailCampaignPreview from "./EmailCampaignPreview";

function statusBadgeClass(status: EmailCampaignStatus) {
  switch (status) {
    case "sent":
      return "bg-teal-50 text-teal-700 border-teal-100";
    case "scheduled":
      return "bg-blue-50 text-blue-700 border-blue-100";
    case "failed":
      return "bg-red-50 text-red-600 border-red-100";
    case "draft":
    default:
      return "bg-amber-50 text-amber-700 border-amber-100";
  }
}

interface EmailCampaignDetailDrawerProps {
  campaign: EmailCampaign | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (campaign: EmailCampaign) => void;
  onDelete: (id: string) => void;
}

export default function EmailCampaignDetailDrawer({
  campaign,
  isOpen,
  onClose,
  onEdit,
  onDelete,
}: EmailCampaignDetailDrawerProps) {
  const [tab, setTab] = useState<"overview" | "preview">("preview");

  if (!campaign) return null;

  const audience = getAudienceLabels(campaign.audienceIds);

  return (
    <DetailDrawer
      isOpen={isOpen}
      onClose={onClose}
      maxWidthClass="max-w-[520px]"
      title={campaign.name}
      badge={
        <span
          className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold capitalize border ${statusBadgeClass(campaign.status)}`}
        >
          {campaign.status}
        </span>
      }
      footer={
        <div className="p-4 flex gap-3">
          <button
            type="button"
            onClick={() => {
              onDelete(campaign.id);
              onClose();
            }}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-full border-2 border-red-200 text-red-600 text-[13px] font-bold hover:bg-red-50 cursor-pointer transition-colors shrink-0"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Delete
          </button>
          <button
            type="button"
            onClick={() => {
              onEdit(campaign);
              onClose();
            }}
            className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 rounded-full bg-linear-to-r from-[#041B40] to-[#0A46A6] hover:bg-[#12503C] text-white text-[13px] font-bold cursor-pointer transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Edit Campaign
          </button>
        </div>
      }
    >
      <DetailDrawerTabs
        tabs={[
          { id: "overview", label: "Overview" },
          { id: "preview", label: "Preview" },
        ]}
        active={tab}
        onChange={setTab}
      />

      {tab === "overview" ? (
        <div className="space-y-4 text-[13px]">
          <div className="flex justify-between">
            <span className="text-zinc-500 font-medium">Subject</span>
            <span className="font-bold text-zinc-900 dark:text-white text-right max-w-[60%]">
              {campaign.subject}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-zinc-500 font-medium">Audience</span>
            <span className="font-bold text-zinc-900 dark:text-white text-right max-w-[60%]">
              {audience.join(", ") || "—"}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-zinc-500 font-medium">Opened</span>
            <span className="font-bold">{campaign.opened?.toLocaleString() ?? "—"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-zinc-500 font-medium">Clicked</span>
            <span className="font-bold">{campaign.clicked?.toLocaleString() ?? "—"}</span>
          </div>
        </div>
      ) : (
        <EmailCampaignPreview
          subject={campaign.subject}
          blocks={campaign.blocks}
          settings={campaign.settings}
        />
      )}
    </DetailDrawer>
  );
}
