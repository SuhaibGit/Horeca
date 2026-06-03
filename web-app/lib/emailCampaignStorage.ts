import { MOCK_EMAIL_CAMPAIGNS, EmailCampaign } from "../data/mockEmailCampaigns";

const STORAGE_KEY = "horeca-email-campaigns-v1";

export function loadEmailCampaigns(): EmailCampaign[] {
  if (typeof window === "undefined") return MOCK_EMAIL_CAMPAIGNS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      saveEmailCampaigns(MOCK_EMAIL_CAMPAIGNS);
      return MOCK_EMAIL_CAMPAIGNS;
    }
    return JSON.parse(raw) as EmailCampaign[];
  } catch {
    return MOCK_EMAIL_CAMPAIGNS;
  }
}

export function saveEmailCampaigns(campaigns: EmailCampaign[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(campaigns));
}

export function upsertEmailCampaign(campaign: EmailCampaign) {
  const list = loadEmailCampaigns();
  const idx = list.findIndex((c) => c.id === campaign.id);
  if (idx >= 0) list[idx] = campaign;
  else list.unshift(campaign);
  saveEmailCampaigns(list);
  return list;
}

export function deleteEmailCampaign(id: string) {
  const list = loadEmailCampaigns().filter((c) => c.id !== id);
  saveEmailCampaigns(list);
  return list;
}
