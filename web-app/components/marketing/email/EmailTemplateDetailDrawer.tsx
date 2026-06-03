"use client";

import React, { useState } from "react";
import DetailDrawer from "../../DetailDrawer";
import DetailDrawerTabs from "../../DetailDrawerTabs";
import {
  EmailTemplate,
  EmailTemplateStatus,
  formatTemplateDisplayDate,
  formatTemplateTime,
  getAudienceLabels,
} from "../../../data/mockEmailTemplates";
import EmailCampaignPreview from "./EmailCampaignPreview";

function statusBadgeClass(status: EmailTemplateStatus) {
  switch (status) {
    case "published":
      return "bg-teal-50 text-teal-700 border-teal-100";
    case "draft":
    default:
      return "bg-amber-50 text-amber-700 border-amber-100";
  }
}

interface EmailTemplateDetailDrawerProps {
  template: EmailTemplate | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (template: EmailTemplate) => void;
  onDelete: (id: string) => void;
  onUseTemplate: (template: EmailTemplate) => void;
}

export default function EmailTemplateDetailDrawer({
  template,
  isOpen,
  onClose,
  onEdit,
  onDelete,
  onUseTemplate,
}: EmailTemplateDetailDrawerProps) {
  const [tab, setTab] = useState<"overview" | "preview">("overview");

  if (!template) return null;

  const audienceLabels = getAudienceLabels(template.audienceIds);

  return (
    <DetailDrawer
      isOpen={isOpen}
      onClose={onClose}
      maxWidthClass="max-w-[520px]"
      title={template.name}
      badge={
        <span
          className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold capitalize border ${statusBadgeClass(template.status)}`}
        >
          {template.status}
        </span>
      }
      headerActions={
        <button
          type="button"
          onClick={() => {
            onEdit(template);
            onClose();
          }}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#0A46A6]/40 text-[#0A46A6] text-[12px] font-bold hover:bg-[#EBF7FF]  cursor-pointer transition-colors"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          Edit
        </button>
      }
      footer={
        <div className="p-4 flex gap-3">
          <button
            type="button"
            onClick={() => {
              onDelete(template.id);
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
              onUseTemplate(template);
              onClose();
            }}
            className="flex-1 py-2.5 rounded-full bg-linear-to-r from-[#041B40] to-[#0A46A6] hover:bg-[#12503C] text-white text-[13px] font-bold cursor-pointer transition-colors"
          >
            Use Template
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
        <div className="space-y-5 text-[13px]">
          <div>
            <p className="text-[12px] font-bold text-zinc-500 mb-2">Audience</p>
            <div className="flex flex-wrap gap-1.5">
              {audienceLabels.map((label) => (
                <span
                  key={label}
                  className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#EBF7FF]  text-[#0A46A6] border border-emerald-100/60"
                >
                  {label}
                </span>
              ))}
            </div>
          </div>

          <div>
            <p className="text-[12px] font-bold text-zinc-500 mb-2">Schedule</p>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800 p-3">
                <p className="text-[11px] font-semibold text-zinc-400">Date</p>
                <p className="text-[14px] font-bold text-zinc-900 dark:text-white mt-1">
                  {formatTemplateDisplayDate(template.scheduleDate)}
                </p>
              </div>
              <div className="rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800 p-3">
                <p className="text-[11px] font-semibold text-zinc-400">Time</p>
                <p className="text-[14px] font-bold text-zinc-900 dark:text-white mt-1">
                  {formatTemplateTime(template.scheduleTime)}
                </p>
              </div>
            </div>
          </div>

          <div>
            <p className="text-[12px] font-bold text-zinc-500 mb-2">Customer Stats</p>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Total Customer", value: template.stats.totalCustomers },
                { label: "Open", value: template.stats.opened },
                { label: "Clicked", value: template.stats.clicked },
                { label: "Pending", value: template.stats.pending },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800 p-3 text-center"
                >
                  <p className="text-[18px] font-bold text-zinc-900 dark:text-white">
                    {stat.value.toLocaleString()}
                  </p>
                  <p className="text-[11px] font-semibold text-zinc-500 mt-0.5">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <EmailCampaignPreview
          subject={template.subject}
          blocks={template.blocks}
          settings={template.settings}
        />
      )}
    </DetailDrawer>
  );
}
