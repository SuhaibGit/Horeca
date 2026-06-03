export type EmailProviderId = "gmail" | "outlook";

export interface EmailConnection {
  connected: boolean;
  provider: EmailProviderId;
  email: string;
}

const STORAGE_KEY = "horeca-email-connection";

export function loadEmailConnection(): EmailConnection | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as EmailConnection;
  } catch {
    return null;
  }
}

export function saveEmailConnection(data: EmailConnection) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function clearEmailConnection() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
}
