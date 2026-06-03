"use client";

import React from "react";
import { EmailTemplate } from "../../../data/mockEmailTemplates";
import { EmailBlockRenderer } from "./EmailCampaignPreview";
import { normalizeEmailSettings } from "../../../data/mockEmailCampaigns";

interface EmailTemplateCardProps {
  template: EmailTemplate;
  onView: () => void;
}

export default function EmailTemplateCard({ template, onView }: EmailTemplateCardProps) {
  const settings = normalizeEmailSettings(template.settings);
  const previewBlock = template.blocks[0];

  return (
    <article className="rounded-2xl border border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col">
      <div
        className="h-36 overflow-hidden relative"
        style={{ backgroundColor: settings.headerColor }}
      >
        {previewBlock ? (
          <div className="scale-[0.55] origin-top-left w-[180%] pointer-events-none opacity-95">
            <EmailBlockRenderer block={previewBlock} settings={settings} />
          </div>
        ) : (
          <div className="h-full flex items-center justify-center text-white/80 text-[12px] font-bold">
            Email Preview
          </div>
        )}
      </div>
      <div className="p-4 flex flex-col flex-1 gap-3">
        <div>
          <h3 className="text-[15px] font-bold text-zinc-900 dark:text-white">{template.name}</h3>
          <p className="text-[12px] font-medium text-zinc-500 dark:text-zinc-400 mt-1 leading-relaxed line-clamp-2">
            {template.description}
          </p>
        </div>
        <button
          type="button"
          onClick={onView}
          className="mt-auto w-full py-2.5 rounded-full border border-zinc-200 dark:border-zinc-700 text-[13px] font-bold text-zinc-700 dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-800 cursor-pointer transition-colors"
        >
          View Template
        </button>
      </div>
    </article>
  );
}
