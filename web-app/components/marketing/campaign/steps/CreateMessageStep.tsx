"use client";

import React from "react";
import {
  CampaignCtaButton,
  CampaignMediaType,
} from "../../../../data/mockWhatsAppCampaigns";

const MEDIA_TABS: { id: CampaignMediaType; label: string }[] = [
  { id: "image", label: "Image" },
  { id: "video", label: "Video" },
  { id: "document", label: "Document" },
  { id: "location", label: "Location" },
];

interface CreateMessageStepProps {
  name: string;
  message: string;
  mediaType: CampaignMediaType;
  mediaFileName?: string;
  buttons: CampaignCtaButton[];
  onNameChange: (v: string) => void;
  onMessageChange: (v: string) => void;
  onMediaTypeChange: (t: CampaignMediaType) => void;
  onMediaFile: (name: string) => void;
  onButtonChange: (id: string, field: "label" | "url", value: string) => void;
  onAddButton: () => void;
  onRemoveButton: (id: string) => void;
}

export default function CreateMessageStep({
  name,
  message,
  mediaType,
  mediaFileName,
  buttons,
  onNameChange,
  onMessageChange,
  onMediaTypeChange,
  onMediaFile,
  onButtonChange,
  onAddButton,
  onRemoveButton,
}: CreateMessageStepProps) {
  const filledButtons = buttons.filter((b) => b.label.trim() || b.url.trim());
  const canAddMore = filledButtons.length < 3;

  return (
    <div className="px-6 sm:px-8 py-4 max-h-[min(52vh,520px)] overflow-y-auto space-y-5">
      <div>
        <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 block mb-1.5">
          Campaign Name
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          placeholder="Weekend Steak Deal"
          className="w-full px-4 py-3 bg-[#f4f5f6] dark:bg-zinc-800/40 border border-zinc-100 dark:border-zinc-800 rounded-xl text-[13px] font-semibold text-zinc-800 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#0A46A6]/50"
        />
      </div>

      <div>
        <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 block mb-1.5">
          Message Content
        </label>
        <div className="border border-zinc-200 dark:border-zinc-700 rounded-xl overflow-hidden">
          <div className="flex items-center gap-1 px-3 py-2 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/80 dark:bg-zinc-900/50">
            {["B", "I", "H1", "🔗", "🖼", "≡", "≡", "≡"].map((t) => (
              <button
                key={t}
                type="button"
                className="min-w-[28px] h-7 px-1.5 rounded text-[11px] font-bold text-zinc-500 hover:bg-zinc-200/60 dark:hover:bg-zinc-700 cursor-default"
              >
                {t === "🔗" ? (
                  <svg className="w-3.5 h-3.5 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                ) : (
                  t
                )}
              </button>
            ))}
          </div>
          <textarea
            value={message}
            onChange={(e) => onMessageChange(e.target.value)}
            rows={5}
            placeholder="Write your promotional message here..."
            className="w-full px-4 py-3 bg-white dark:bg-zinc-900 text-[13px] font-medium text-zinc-800 dark:text-zinc-100 placeholder-zinc-400 resize-none focus:outline-none"
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {MEDIA_TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => onMediaTypeChange(tab.id)}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-[12px] font-bold border transition-all cursor-pointer ${mediaType === tab.id
              ? "bg-linear-to-r from-[#041B40] to-[#0A46A6] border-[#0A46A6] text-white"
              : "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300"
              }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {mediaType === "image" && (
        <div>
          <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 block mb-1.5">
            Upload Image (Optional)
          </label>
          <label className="flex flex-col items-center justify-center gap-2 py-10 px-4 border-2 border-dashed border-zinc-200 dark:border-zinc-700 rounded-2xl bg-zinc-50/50 dark:bg-zinc-900/30 cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-800/40 transition-colors">
            <input
              type="file"
              accept="image/png,image/jpeg"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) onMediaFile(f.name);
              }}
            />
            <svg className="w-8 h-8 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            <span className="text-[13px] font-semibold text-zinc-600 dark:text-zinc-300">
              {mediaFileName ? mediaFileName : "Click to upload image"}
            </span>
            <span className="text-[11px] font-medium text-zinc-400">PNG, JPG up to 5MB</span>
          </label>
        </div>
      )}

      <div>
        <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 block mb-2">
          Button (Optional)
        </label>
        <div className="space-y-2">
          {buttons.map((btn) => (
            <div key={btn.id} className="flex items-center gap-2">
              <span className="text-zinc-300 cursor-grab shrink-0" aria-hidden>
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <circle cx="9" cy="6" r="1.2" />
                  <circle cx="15" cy="6" r="1.2" />
                  <circle cx="9" cy="12" r="1.2" />
                  <circle cx="15" cy="12" r="1.2" />
                  <circle cx="9" cy="18" r="1.2" />
                  <circle cx="15" cy="18" r="1.2" />
                </svg>
              </span>
              <input
                type="text"
                placeholder="e.g., Book Now"
                value={btn.label}
                onChange={(e) => onButtonChange(btn.id, "label", e.target.value)}
                className="flex-1 px-3 py-2.5 bg-[#f4f5f6] dark:bg-zinc-800/40 border border-zinc-100 dark:border-zinc-800 rounded-xl text-[12px] font-medium"
              />
              <input
                type="url"
                placeholder="https://..."
                value={btn.url}
                onChange={(e) => onButtonChange(btn.id, "url", e.target.value)}
                className="flex-1 px-3 py-2.5 bg-[#f4f5f6] dark:bg-zinc-800/40 border border-zinc-100 dark:border-zinc-800 rounded-xl text-[12px] font-medium"
              />
              <button
                type="button"
                onClick={() => onRemoveButton(btn.id)}
                className="p-2 text-zinc-400 hover:text-red-500 cursor-pointer shrink-0"
                aria-label="Remove button"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between mt-2">
          {canAddMore ? (
            <button
              type="button"
              onClick={onAddButton}
              className="text-[12px] font-bold text-[#0A46A6] dark:text-[#28A388] hover:underline cursor-pointer"
            >
              + Add Button
            </button>
          ) : (
            <span />
          )}
          <span className="text-[11px] font-medium text-zinc-400">Max 3 Buttons Allow</span>
        </div>
      </div>
    </div>
  );
}
