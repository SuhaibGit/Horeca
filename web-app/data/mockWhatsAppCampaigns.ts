export type WhatsAppCampaignStatus = "draft" | "scheduled" | "sent" | "failed";

export type CampaignMediaType = "image" | "video" | "document" | "location";

export interface AudienceSegment {
  id: string;
  title: string;
  description: string;
  customerCount: number;
  icon: "users" | "calendar" | "trend" | "dollar" | "target" | "birthday";
}

export interface CampaignCtaButton {
  id: string;
  label: string;
  url: string;
}

export interface WhatsAppCampaign {
  id: string;
  name: string;
  audienceIds: string[];
  message: string;
  mediaType: CampaignMediaType;
  mediaFileName?: string;
  buttons: CampaignCtaButton[];
  scheduleDate: string;
  scheduleTime: string;
  status: WhatsAppCampaignStatus;
  opened?: number;
  clicked?: number;
  createdAt: string;
  updatedAt: string;
}

export interface WhatsAppCampaignStats {
  totalCampaigns: number;
  sent: number;
  scheduled: number;
}

export const AUDIENCE_SEGMENTS: AudienceSegment[] = [
  {
    id: "all",
    title: "All Customers",
    description: "Send to all your customers",
    customerCount: 1250,
    icon: "users",
  },
  {
    id: "reservation",
    title: "Reservation Guests",
    description: "Customers with active reservations",
    customerCount: 210,
    icon: "calendar",
  },
  {
    id: "repeat",
    title: "Repeat Customers",
    description: "Customers who visit frequently",
    customerCount: 580,
    icon: "trend",
  },
  {
    id: "high-spenders",
    title: "High Spenders",
    description: "Customers with high average spend",
    customerCount: 180,
    icon: "dollar",
  },
  {
    id: "new",
    title: "New Customers",
    description: "Recently joined customers",
    customerCount: 95,
    icon: "target",
  },
  {
    id: "birthday",
    title: "Birthday Guests",
    description: "Customers with upcoming birthdays",
    customerCount: 45,
    icon: "birthday",
  },
];

export const MOCK_WHATSAPP_CAMPAIGNS: WhatsAppCampaign[] = [
  {
    id: "wa-1",
    name: "New Menu Launch",
    audienceIds: ["reservation", "high-spenders", "repeat", "new"],
    message:
      "Discover our new seasonal menu! Book your table today and be among the first to try our chef's latest creations.",
    mediaType: "image",
    buttons: [{ id: "b1", label: "Book Now", url: "https://horeca.app/book" }],
    scheduleDate: "2026-05-20",
    scheduleTime: "18:00",
    status: "sent",
    opened: 892,
    clicked: 214,
    createdAt: "2026-04-01T10:00:00Z",
    updatedAt: "2026-05-20T18:00:00Z",
  },
  {
    id: "wa-2",
    name: "Weekend Steak Deal",
    audienceIds: ["high-spenders", "all"],
    message:
      "Craving something delicious? Enjoy our exclusive restaurant deal today! Get 20% off your entire meal when you order through WhatsApp.",
    mediaType: "image",
    buttons: [
      { id: "b1", label: "Book Now", url: "https://horeca.app/book" },
      { id: "b2", label: "Reserve Now", url: "https://horeca.app/reserve" },
    ],
    scheduleDate: "2026-05-22",
    scheduleTime: "12:00",
    status: "scheduled",
    createdAt: "2026-05-10T08:00:00Z",
    updatedAt: "2026-05-10T08:00:00Z",
  },
  {
    id: "wa-3",
    name: "Happy Hour Promo",
    audienceIds: ["all"],
    message: "Join us for happy hour — 2-for-1 on selected drinks every Friday 5–7 PM.",
    mediaType: "image",
    buttons: [],
    scheduleDate: "",
    scheduleTime: "",
    status: "draft",
    createdAt: "2026-05-15T14:00:00Z",
    updatedAt: "2026-05-15T14:00:00Z",
  },
  {
    id: "wa-4",
    name: "Mother's Day Brunch",
    audienceIds: ["birthday", "reservation"],
    message: "Treat Mom to a special brunch this Sunday. Limited seats available!",
    mediaType: "image",
    buttons: [{ id: "b1", label: "Reserve", url: "https://horeca.app/reserve" }],
    scheduleDate: "2026-05-11",
    scheduleTime: "09:00",
    status: "failed",
    createdAt: "2026-05-08T11:00:00Z",
    updatedAt: "2026-05-11T09:00:00Z",
  },
  {
    id: "wa-5",
    name: "Loyalty Rewards",
    audienceIds: ["repeat", "high-spenders"],
    message: "You've earned bonus loyalty points! Redeem them on your next visit.",
    mediaType: "document",
    buttons: [],
    scheduleDate: "2026-05-18",
    scheduleTime: "16:30",
    status: "sent",
    opened: 420,
    clicked: 88,
    createdAt: "2026-05-01T09:00:00Z",
    updatedAt: "2026-05-18T16:30:00Z",
  },
];

export const MOCK_CAMPAIGN_STATS: WhatsAppCampaignStats = {
  totalCampaigns: 50,
  sent: 1200,
  scheduled: 2,
};

export const CAMPAIGN_WIZARD_STEPS = [
  { id: 1, label: "Select Audience" },
  { id: 2, label: "Create Message" },
  { id: 3, label: "Schedule" },
  { id: 4, label: "Review & Confirm" },
] as const;

export function getAudienceLabels(ids: string[]): string[] {
  return ids
    .map((id) => AUDIENCE_SEGMENTS.find((s) => s.id === id)?.title)
    .filter((t): t is string => Boolean(t));
}

export function estimateReach(audienceIds: string[]): number {
  if (audienceIds.includes("all")) {
    return AUDIENCE_SEGMENTS.find((s) => s.id === "all")?.customerCount ?? 1250;
  }
  const sum = audienceIds.reduce((acc, id) => {
    const seg = AUDIENCE_SEGMENTS.find((s) => s.id === id);
    return acc + (seg?.customerCount ?? 0);
  }, 0);
  return Math.min(sum, 1250);
}

export function createEmptyCampaignForm(): Omit<WhatsAppCampaign, "id" | "createdAt" | "updatedAt"> {
  return {
    name: "",
    audienceIds: [],
    message: "",
    mediaType: "image",
    buttons: [
      { id: "btn-1", label: "", url: "" },
      { id: "btn-2", label: "", url: "" },
      { id: "btn-3", label: "", url: "" },
    ],
    scheduleDate: "",
    scheduleTime: "",
    status: "draft",
  };
}

export function campaignToForm(c: WhatsAppCampaign): Omit<WhatsAppCampaign, "id" | "createdAt" | "updatedAt"> {
  const buttons =
    c.buttons.length >= 3
      ? c.buttons
      : [
          ...c.buttons,
          ...Array.from({ length: 3 - c.buttons.length }, (_, i) => ({
            id: `btn-${i}`,
            label: "",
            url: "",
          })),
        ].slice(0, 3);
  return {
    name: c.name,
    audienceIds: [...c.audienceIds],
    message: c.message,
    mediaType: c.mediaType,
    mediaFileName: c.mediaFileName,
    buttons,
    scheduleDate: c.scheduleDate,
    scheduleTime: c.scheduleTime,
    status: c.status,
    opened: c.opened,
    clicked: c.clicked,
  };
}
