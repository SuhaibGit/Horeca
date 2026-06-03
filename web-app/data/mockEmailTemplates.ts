import {
  EmailBlock,
  EmailBuilderSettings,
  EmailCampaign,
  createDefaultEmailBlocks,
  DEFAULT_EMAIL_SETTINGS,
  normalizeEmailSettings,
} from "./mockEmailCampaigns";
import { getAudienceLabels } from "./mockWhatsAppCampaigns";

export { getAudienceLabels };

export type EmailTemplateStatus = "draft" | "published";

export interface EmailTemplateStats {
  totalCustomers: number;
  opened: number;
  clicked: number;
  pending: number;
}

export interface EmailTemplate {
  id: string;
  name: string;
  description: string;
  subject: string;
  audienceIds: string[];
  blocks: EmailBlock[];
  settings: EmailBuilderSettings;
  scheduleDate: string;
  scheduleTime: string;
  status: EmailTemplateStatus;
  stats: EmailTemplateStats;
  createdAt: string;
  updatedAt: string;
}

export const EMAIL_TEMPLATE_WIZARD_STEPS = [
  { id: 1, label: "Select Audience" },
  { id: 2, label: "Email Builder" },
  { id: 3, label: "Schedule" },
  { id: 4, label: "Review & Confirm" },
] as const;

export const MOCK_EMAIL_TEMPLATES: EmailTemplate[] = [
  {
    id: "tpl-1",
    name: "Promotional Offer",
    description: "Drive sales with a compelling promotion or discount.",
    subject: "Big Deal This Friday",
    audienceIds: ["reservation", "high-spenders", "repeat"],
    blocks: createDefaultEmailBlocks(),
    settings: DEFAULT_EMAIL_SETTINGS,
    scheduleDate: "2024-05-20",
    scheduleTime: "20:00",
    status: "published",
    stats: { totalCustomers: 5000, opened: 890, clicked: 320, pending: 3790 },
    createdAt: "2026-03-01T10:00:00Z",
    updatedAt: "2026-04-15T10:00:00Z",
  },
  {
    id: "tpl-2",
    name: "Weekend Special",
    description: "Highlight weekend dining deals and limited-time offers.",
    subject: "Your Weekend Table Awaits",
    audienceIds: ["all"],
    blocks: createDefaultEmailBlocks(),
    settings: { ...DEFAULT_EMAIL_SETTINGS, buttonColor: "#0A46A6" },
    scheduleDate: "2024-06-01",
    scheduleTime: "12:00",
    status: "published",
    stats: { totalCustomers: 4200, opened: 720, clicked: 210, pending: 3270 },
    createdAt: "2026-03-05T10:00:00Z",
    updatedAt: "2026-04-10T10:00:00Z",
  },
  {
    id: "tpl-3",
    name: "New Menu Launch",
    description: "Announce seasonal menus and chef specials to guests.",
    subject: "Discover Our New Seasonal Menu",
    audienceIds: ["repeat", "new"],
    blocks: createDefaultEmailBlocks(),
    settings: DEFAULT_EMAIL_SETTINGS,
    scheduleDate: "2024-05-15",
    scheduleTime: "18:00",
    status: "published",
    stats: { totalCustomers: 3100, opened: 540, clicked: 180, pending: 2380 },
    createdAt: "2026-03-08T10:00:00Z",
    updatedAt: "2026-04-01T10:00:00Z",
  },
  {
    id: "tpl-4",
    name: "Birthday Celebration",
    description: "Send birthday offers and personalized guest invitations.",
    subject: "Celebrate With Us — Special Birthday Offer",
    audienceIds: ["birthday"],
    blocks: createDefaultEmailBlocks(),
    settings: DEFAULT_EMAIL_SETTINGS,
    scheduleDate: "",
    scheduleTime: "",
    status: "draft",
    stats: { totalCustomers: 450, opened: 0, clicked: 0, pending: 450 },
    createdAt: "2026-05-01T10:00:00Z",
    updatedAt: "2026-05-01T10:00:00Z",
  },
  {
    id: "tpl-5",
    name: "VIP Loyalty Rewards",
    description: "Reward high spenders with exclusive loyalty perks.",
    subject: "Exclusive Rewards for Our VIP Guests",
    audienceIds: ["high-spenders"],
    blocks: createDefaultEmailBlocks(),
    settings: DEFAULT_EMAIL_SETTINGS,
    scheduleDate: "2024-07-10",
    scheduleTime: "16:00",
    status: "published",
    stats: { totalCustomers: 1800, opened: 410, clicked: 155, pending: 1235 },
    createdAt: "2026-03-12T10:00:00Z",
    updatedAt: "2026-04-20T10:00:00Z",
  },
  {
    id: "tpl-6",
    name: "Reservation Reminder",
    description: "Remind guests about upcoming reservations and table times.",
    subject: "See You Soon — Reservation Reminder",
    audienceIds: ["reservation"],
    blocks: createDefaultEmailBlocks(),
    settings: DEFAULT_EMAIL_SETTINGS,
    scheduleDate: "2024-05-18",
    scheduleTime: "09:00",
    status: "published",
    stats: { totalCustomers: 2100, opened: 680, clicked: 90, pending: 1330 },
    createdAt: "2026-03-18T10:00:00Z",
    updatedAt: "2026-04-05T10:00:00Z",
  },
];

export function createEmptyEmailTemplateForm(): Omit<
  EmailTemplate,
  "id" | "createdAt" | "updatedAt" | "stats"
> {
  return {
    name: "",
    description: "",
    subject: "",
    audienceIds: [],
    blocks: createDefaultEmailBlocks(),
    settings: { ...DEFAULT_EMAIL_SETTINGS },
    scheduleDate: "",
    scheduleTime: "",
    status: "draft",
  };
}

export function emailTemplateToForm(
  t: EmailTemplate
): Omit<EmailTemplate, "id" | "createdAt" | "updatedAt" | "stats"> {
  return {
    name: t.name,
    description: t.description,
    subject: t.subject,
    audienceIds: [...t.audienceIds],
    blocks: t.blocks.map((b) => ({ ...b, content: { ...b.content } })),
    settings: normalizeEmailSettings(t.settings),
    scheduleDate: t.scheduleDate,
    scheduleTime: t.scheduleTime,
    status: t.status,
  };
}

export function duplicateEmailTemplate(t: EmailTemplate): EmailTemplate {
  const now = new Date().toISOString();
  return {
    ...t,
    id: `tpl-${Date.now()}`,
    name: `${t.name} (Copy)`,
    status: "draft",
    stats: { totalCustomers: 0, opened: 0, clicked: 0, pending: 0 },
    createdAt: now,
    updatedAt: now,
    blocks: t.blocks.map((b) => ({
      ...b,
      id: `blk-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      content: { ...b.content },
    })),
  };
}

export function templateToCampaignDraft(t: EmailTemplate): EmailCampaign {
  const now = new Date().toISOString();
  return {
    id: `em-${Date.now()}`,
    name: t.name,
    subject: t.subject,
    audienceIds: [...t.audienceIds],
    blocks: t.blocks.map((b) => ({ ...b, content: { ...b.content } })),
    settings: normalizeEmailSettings(t.settings),
    scheduleDate: t.scheduleDate,
    scheduleTime: t.scheduleTime,
    status: "draft",
    createdAt: now,
    updatedAt: now,
  };
}

export function formatTemplateTime(time24: string) {
  if (!time24) return "—";
  const [h, m] = time24.split(":").map(Number);
  if (Number.isNaN(h)) return time24;
  const period = h >= 12 ? "PM" : "AM";
  const hour12 = h % 12 || 12;
  return `${String(hour12).padStart(2, "0")}:${String(m ?? 0).padStart(2, "0")} ${period}`;
}

export function formatTemplateDisplayDate(isoDate: string) {
  if (!isoDate) return "—";
  const [y, m, d] = isoDate.split("-");
  if (!d) return isoDate;
  return `${d}/${m}/${y}`;
}
