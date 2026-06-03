"use client";

import React from "react";
import {
  EmailBlock,
  EmailBlockContent,
  EmailBuilderSettings,
  DEFAULT_EMAIL_SETTINGS,
  emailFontStack,
  normalizeEmailSettings,
} from "../../../data/mockEmailCampaigns";

interface EmailBlockRendererProps {
  block: EmailBlock;
  settings: EmailBuilderSettings;
  editable?: boolean;
  onContentChange?: (content: EmailBlockContent) => void;
}

function stopDrag(e: React.MouseEvent | React.FocusEvent) {
  e.stopPropagation();
}

function fieldClassName() {
  return "w-full bg-transparent border border-transparent hover:border-zinc-200 focus:border-[#0A46A6]/50 focus:outline-none rounded-lg px-1 py-0.5 transition-colors";
}

export function EmailBlockRenderer({
  block,
  settings: rawSettings,
  editable = false,
  onContentChange,
}: EmailBlockRendererProps) {
  const settings = normalizeEmailSettings(rawSettings);
  const { content } = block;
  const patch = (partial: Partial<EmailBlockContent>) => {
    onContentChange?.({ ...content, ...partial });
  };

  const btnColor = content.buttonColor ?? settings.buttonColor;
  const btnStyle = {
    backgroundColor: btnColor,
    borderRadius: `${settings.cornerRadius}px`,
    color: "#fff",
  };

  switch (block.type) {
    case "header":
      return (
        <div
          className="px-6 py-4 text-center text-white font-bold text-lg"
          style={{ backgroundColor: settings.headerColor }}
        >
          {editable ? (
            <input
              type="text"
              value={content.heading ?? ""}
              onChange={(e) => patch({ heading: e.target.value })}
              onMouseDown={stopDrag}
              onClick={stopDrag}
              placeholder="Header text"
              className={`${fieldClassName()} text-center text-white placeholder:text-white/60 font-bold text-lg`}
            />
          ) : (
            content.heading ?? "HORECA"
          )}
        </div>
      );
    case "text":
      return (
        <div className="px-6 py-4 space-y-2" style={{ color: settings.textColor }}>
          {editable ? (
            <>
              <input
                type="text"
                value={content.heading ?? ""}
                onChange={(e) => patch({ heading: e.target.value })}
                onMouseDown={stopDrag}
                onClick={stopDrag}
                placeholder="Heading"
                className={`${fieldClassName()} text-[18px] font-bold`}
                style={{ color: settings.textColor }}
              />
              <textarea
                value={content.body ?? ""}
                onChange={(e) => patch({ body: e.target.value })}
                onMouseDown={stopDrag}
                onClick={stopDrag}
                placeholder="Write your message here..."
                rows={3}
                className={`${fieldClassName()} text-[13px] font-medium resize-y min-h-[72px]`}
                style={{ color: settings.textColor }}
              />
            </>
          ) : (
            <>
              {content.heading && (
                <p className="text-[18px] font-bold leading-snug">{content.heading}</p>
              )}
              {content.body && (
                <p className="text-[13px] font-medium leading-relaxed opacity-90">{content.body}</p>
              )}
            </>
          )}
        </div>
      );
    case "image":
      return (
        <div className="px-6 py-3">
          <div className="border-2 border-dashed border-zinc-200 rounded-xl py-10 flex flex-col items-center justify-center text-zinc-400 bg-zinc-50">
            <svg className="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            {editable ? (
              <input
                type="text"
                value={content.imageAlt ?? ""}
                onChange={(e) => patch({ imageAlt: e.target.value })}
                onMouseDown={stopDrag}
                onClick={stopDrag}
                placeholder="Image description"
                className={`${fieldClassName()} text-center text-[12px] max-w-[200px]`}
              />
            ) : (
              <span className="text-[12px] font-semibold">{content.imageAlt ?? "Image"}</span>
            )}
          </div>
        </div>
      );
    case "button":
      return (
        <div className="px-6 py-4 flex flex-col items-center gap-2">
          {editable ? (
            <>
              <input
                type="text"
                value={content.buttonLabel ?? ""}
                onChange={(e) => patch({ buttonLabel: e.target.value })}
                onMouseDown={stopDrag}
                onClick={stopDrag}
                placeholder="Button label"
                className={`${fieldClassName()} text-center text-[13px] font-bold max-w-[200px]`}
              />
              <input
                type="url"
                value={content.buttonUrl ?? ""}
                onChange={(e) => patch({ buttonUrl: e.target.value })}
                onMouseDown={stopDrag}
                onClick={stopDrag}
                placeholder="https://..."
                className={`${fieldClassName()} text-center text-[11px] text-zinc-500 max-w-[240px]`}
              />
            </>
          ) : null}
          <span className="px-8 py-3 text-[13px] font-bold inline-block" style={btnStyle}>
            {content.buttonLabel ?? "Learn More"}
          </span>
        </div>
      );
    case "divider":
      return <hr className="mx-6 border-zinc-200" />;
    case "spacer":
      return <div className="h-6" />;
    case "social":
      return (
        <div className="px-6 py-4 flex justify-center gap-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="w-9 h-9 rounded-full bg-zinc-200" />
          ))}
        </div>
      );
    case "html":
      return editable ? (
        <div className="px-6 py-3">
          <textarea
            value={content.body ?? ""}
            onChange={(e) => patch({ body: e.target.value })}
            onMouseDown={stopDrag}
            onClick={stopDrag}
            rows={4}
            className={`${fieldClassName()} text-[12px] font-mono w-full`}
            placeholder="<p>Custom HTML</p>"
          />
        </div>
      ) : (
        <div
          className="px-6 py-3 text-[13px]"
          dangerouslySetInnerHTML={{ __html: content.body ?? "" }}
        />
      );
    case "video":
      return (
        <div className="px-6 py-3">
          <div className="rounded-xl bg-zinc-900/90 aspect-video flex items-center justify-center text-white text-[12px] font-bold">
            {editable ? (
              <input
                type="text"
                value={content.body ?? ""}
                onChange={(e) => patch({ body: e.target.value })}
                onMouseDown={stopDrag}
                onClick={stopDrag}
                placeholder="Video caption"
                className={`${fieldClassName()} text-center text-white text-[12px] max-w-[200px]`}
              />
            ) : (
              "Video block"
            )}
          </div>
        </div>
      );
    default:
      return null;
  }
}

interface EmailCampaignPreviewProps {
  subject: string;
  blocks: EmailBlock[];
  settings?: EmailBuilderSettings;
  fromLabel?: string;
  compact?: boolean;
}

export default function EmailCampaignPreview({
  subject,
  blocks,
  settings: rawSettings = DEFAULT_EMAIL_SETTINGS,
  fromLabel = "HORECA Restaurant",
  compact = false,
}: EmailCampaignPreviewProps) {
  const settings = normalizeEmailSettings(rawSettings);
  const width = compact ? "100%" : settings.contentWidth;

  return (
    <div className={compact ? "space-y-3" : "space-y-4"}>
      <div className="rounded-xl bg-zinc-100 dark:bg-zinc-800/50 px-4 py-3 text-[12px] font-medium text-zinc-600 dark:text-zinc-400 space-y-0.5  ">
        <p>
          <span className="text-zinc-400">From:</span> {fromLabel}
        </p>
        <p>
          <span className="text-zinc-400">Subject:</span>{" "}
          <span className="font-bold text-zinc-800 dark:text-zinc-200">{subject || "—"}</span>
        </p>
      </div>
      <div
        className="rounded-2xl overflow-hidden border border-zinc-100 dark:border-zinc-800 shadow-sm mx-auto transition-all duration-200"
        style={{
          backgroundColor: settings.backgroundColor,
          width,
          maxWidth: "100%",
          fontFamily: emailFontStack(settings.fontFamily),
          padding: "16px 12px",
        }}
      >
        <div
          className="bg-white dark:bg-zinc-900 rounded-xl overflow-hidden shadow-sm"
          style={{ color: settings.textColor }}
        >
          {blocks.map((block) => (
            <EmailBlockRenderer key={block.id} block={block} settings={settings} />
          ))}
        </div>
      </div>
    </div>
  );
}
