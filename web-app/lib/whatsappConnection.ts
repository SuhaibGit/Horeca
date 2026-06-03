export interface WhatsAppConnection {
  connected: boolean;
  businessName: string;
  countryCode: string;
  phone: string;
}

const STORAGE_KEY = "horeca-whatsapp-connection";

export function loadWhatsAppConnection(): WhatsAppConnection | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as WhatsAppConnection;
  } catch {
    return null;
  }
}

export function saveWhatsAppConnection(data: WhatsAppConnection) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function formatWhatsAppPhone(countryCode: string, phone: string): string {
  const digits = phone.replace(/\D/g, "");
  const code = countryCode.startsWith("+") ? countryCode : `+${countryCode}`;
  return `${code} ${digits}`.trim();
}
