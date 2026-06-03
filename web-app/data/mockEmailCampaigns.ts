import {
  AUDIENCE_SEGMENTS,
  estimateReach,
  getAudienceLabels,
} from "./mockWhatsAppCampaigns";

export { AUDIENCE_SEGMENTS, estimateReach, getAudienceLabels };

export type EmailCampaignStatus = "draft" | "scheduled" | "sent" | "failed";

export type EmailBlockType =
  | "header"
  | "text"
  | "image"
  | "button"
  | "divider"
  | "spacer"
  | "social"
  | "html"
  | "video";

export interface EmailBlockContent {
  heading?: string;
  body?: string;
  buttonLabel?: string;
  buttonUrl?: string;
  buttonColor?: string;
  imageAlt?: string;
}

export interface EmailBlock {
  id: string;
  type: EmailBlockType;
  content: EmailBlockContent;
}

export interface EmailBuilderSettings {
  backgroundColor: string;
  contentWidth: number;
  fontFamily: string;
  headerColor: string;
  buttonColor: string;
  textColor: string;
  cornerRadius: number;
}

/** Ensures older saved campaigns get headerColor after schema change. */
export function normalizeEmailSettings(settings: EmailBuilderSettings): EmailBuilderSettings {
  return {
    ...DEFAULT_EMAIL_SETTINGS,
    ...settings,
    headerColor: settings.headerColor ?? DEFAULT_EMAIL_SETTINGS.headerColor,
  };
}

export interface EmailCampaign {
  id: string;
  name: string;
  subject: string;
  audienceIds: string[];
  blocks: EmailBlock[];
  settings: EmailBuilderSettings;
  scheduleDate: string;
  scheduleTime: string;
  status: EmailCampaignStatus;
  opened?: number;
  clicked?: number;
  createdAt: string;
  updatedAt: string;
}

export interface EmailCampaignStats {
  totalCampaigns: number;
  sentEmails: number;
  openRate: number;
  clickRate: number;
}

export const EMAIL_WIZARD_STEPS = [
  { id: 1, label: "Select Audience" },
  { id: 2, label: "Email Builder" },
  { id: 3, label: "Schedule" },
  { id: 4, label: "Review & Confirm" },
] as const;

export const EMAIL_BLOCK_PALETTE: { type: EmailBlockType; label: string }[] = [
  { type: "header", label: "Header" },
  { type: "text", label: "Text" },
  { type: "image", label: "Image" },
  { type: "button", label: "Button" },
  { type: "divider", label: "Divider" },
  { type: "spacer", label: "Spacer" },
  { type: "social", label: "Social Links" },
  { type: "html", label: "HTML" },
  { type: "video", label: "Video" },
];

export const DEFAULT_EMAIL_SETTINGS: EmailBuilderSettings = {
  backgroundColor: "#f4f4f5",
  contentWidth: 600,
  fontFamily: "Inter",
  headerColor: "#1a3c2e",
  buttonColor: "#1a3c2e",
  textColor: "#1a1a1a",
  cornerRadius: 14,
};

export function emailFontStack(fontFamily: string) {
  const stacks: Record<string, string> = {
    Inter: "Inter, system-ui, -apple-system, sans-serif",
    Arial: "Arial, Helvetica, sans-serif",
    Georgia: "Georgia, 'Times New Roman', serif",
  };
  return stacks[fontFamily] ?? `${fontFamily}, sans-serif`;
}

function newBlockId() {
  return `blk-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export function createEmailBlock(type: EmailBlockType): EmailBlock {
  const defaults: Record<EmailBlockType, EmailBlockContent> = {
    header: { heading: "HORECA" },
    text: {
      heading: "Email heading goes here",
      body: "Write your message here. Keep it concise and relevant to your guests.",
    },
    image: { imageAlt: "Campaign image" },
    button: { buttonLabel: "Learn More", buttonUrl: "https://horeca.app" },
    divider: {},
    spacer: {},
    social: {},
    html: { body: "<p>Custom HTML block</p>" },
    video: { body: "Video placeholder" },
  };
  return { id: newBlockId(), type, content: { ...defaults[type] } };
}

export function createDefaultEmailBlocks(): EmailBlock[] {
  return [
    createEmailBlock("header"),
    createEmailBlock("text"),
    createEmailBlock("image"),
    createEmailBlock("button"),
    createEmailBlock("divider"),
    createEmailBlock("social"),
  ];
}

export const MOCK_EMAIL_CAMPAIGN_STATS: EmailCampaignStats = {
  totalCampaigns: 6,
  sentEmails: 1200,
  openRate: 33.8,
  clickRate: 13.0,
};

export const MOCK_EMAIL_CAMPAIGNS: EmailCampaign[] = [
  {
    id: "em-1",
    name: "New Menu Launch",
    subject: "Discover Our New Seasonal Menu",
    audienceIds: ["reservation", "high-spenders", "repeat", "new"],
    blocks: createDefaultEmailBlocks(),
    settings: DEFAULT_EMAIL_SETTINGS,
    scheduleDate: "2026-05-20",
    scheduleTime: "18:00",
    status: "sent",
    opened: 892,
    clicked: 214,
    createdAt: "2026-04-01T10:00:00Z",
    updatedAt: "2026-05-20T18:00:00Z",
  },
  {
    id: "em-2",
    name: "Big Deal This Friday",
    subject: "Big Deal This Friday",
    audienceIds: ["high-spenders", "all"],
    blocks: [
      {
        id: "em2-h1",
        type: "header",
        content: { heading: "LOGO COMPANY" },
      },
      {
        id: "em2-t1",
        type: "text",
        content: {
          heading: "Welcome to [Logo Company]",
          body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Treat yourself to an exclusive offer this Friday.",
        },
      },
      {
        id: "em2-b1",
        type: "button",
        content: { buttonLabel: "Book Now", buttonUrl: "https://horeca.app/book" },
      },
    ],
    settings: DEFAULT_EMAIL_SETTINGS,
    scheduleDate: "2026-05-22",
    scheduleTime: "12:00",
    status: "sent",
    opened: 640,
    clicked: 156,
    createdAt: "2026-05-10T08:00:00Z",
    updatedAt: "2026-05-22T12:00:00Z",
  },
  {
    id: "em-3",
    name: "Weekend Steak Deal",
    subject: "Weekend Steak Deal — 20% Off",
    audienceIds: ["high-spenders", "all"],
    blocks: createDefaultEmailBlocks(),
    settings: DEFAULT_EMAIL_SETTINGS,
    scheduleDate: "2026-05-25",
    scheduleTime: "10:00",
    status: "scheduled",
    createdAt: "2026-05-12T08:00:00Z",
    updatedAt: "2026-05-12T08:00:00Z",
  },
  {
    id: "em-4",
    name: "Happy Hour Promo",
    subject: "Happy Hour — 2-for-1 Drinks",
    audienceIds: ["all"],
    blocks: createDefaultEmailBlocks(),
    settings: DEFAULT_EMAIL_SETTINGS,
    scheduleDate: "",
    scheduleTime: "",
    status: "draft",
    createdAt: "2026-05-15T14:00:00Z",
    updatedAt: "2026-05-15T14:00:00Z",
  },
  {
    id: "em-5",
    name: "Mother's Day Brunch",
    subject: "Reserve Mom's Day Brunch",
    audienceIds: ["birthday", "reservation"],
    blocks: createDefaultEmailBlocks(),
    settings: DEFAULT_EMAIL_SETTINGS,
    scheduleDate: "2026-05-11",
    scheduleTime: "09:00",
    status: "failed",
    createdAt: "2026-05-08T11:00:00Z",
    updatedAt: "2026-05-11T09:00:00Z",
  },
];

export function createEmptyEmailCampaignForm(): Omit<
  EmailCampaign,
  "id" | "createdAt" | "updatedAt"
> {
  return {
    name: "",
    subject: "",
    audienceIds: [],
    blocks: createDefaultEmailBlocks(),
    settings: { ...DEFAULT_EMAIL_SETTINGS },
    scheduleDate: "",
    scheduleTime: "",
    status: "draft",
  };
}

export function emailCampaignToForm(
  c: EmailCampaign
): Omit<EmailCampaign, "id" | "createdAt" | "updatedAt"> {
  return {
    name: c.name,
    subject: c.subject,
    audienceIds: [...c.audienceIds],
    blocks: c.blocks.map((b) => ({ ...b, content: { ...b.content } })),
    settings: { ...c.settings },
    scheduleDate: c.scheduleDate,
    scheduleTime: c.scheduleTime,
    status: c.status,
    opened: c.opened,
    clicked: c.clicked,
  };
}

export function duplicateEmailCampaign(c: EmailCampaign): EmailCampaign {
  const now = new Date().toISOString();
  return {
    ...c,
    id: `em-${Date.now()}`,
    name: `${c.name} (Copy)`,
    status: "draft",
    opened: undefined,
    clicked: undefined,
    createdAt: now,
    updatedAt: now,
    blocks: c.blocks.map((b) => ({
      ...b,
      id: newBlockId(),
      content: { ...b.content },
    })),
  };
}
