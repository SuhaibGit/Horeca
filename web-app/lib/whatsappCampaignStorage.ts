import { MOCK_WHATSAPP_CAMPAIGNS, WhatsAppCampaign } from "../data/mockWhatsAppCampaigns";

const STORAGE_KEY = "horeca-whatsapp-campaigns-v1";

export function loadCampaigns(): WhatsAppCampaign[] {
  if (typeof window === "undefined") return MOCK_WHATSAPP_CAMPAIGNS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      saveCampaigns(MOCK_WHATSAPP_CAMPAIGNS);
      return MOCK_WHATSAPP_CAMPAIGNS;
    }
    return JSON.parse(raw) as WhatsAppCampaign[];
  } catch {
    return MOCK_WHATSAPP_CAMPAIGNS;
  }
}

export function saveCampaigns(campaigns: WhatsAppCampaign[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(campaigns));
}

export function upsertCampaign(campaign: WhatsAppCampaign) {
  const list = loadCampaigns();
  const idx = list.findIndex((c) => c.id === campaign.id);
  if (idx >= 0) list[idx] = campaign;
  else list.unshift(campaign);
  saveCampaigns(list);
  return list;
}

export function deleteCampaign(id: string) {
  const list = loadCampaigns().filter((c) => c.id !== id);
  saveCampaigns(list);
  return list;
}
