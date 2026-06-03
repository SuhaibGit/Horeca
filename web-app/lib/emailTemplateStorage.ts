import { MOCK_EMAIL_TEMPLATES, EmailTemplate } from "../data/mockEmailTemplates";

const STORAGE_KEY = "horeca-email-templates-v1";

export function loadEmailTemplates(): EmailTemplate[] {
  if (typeof window === "undefined") return MOCK_EMAIL_TEMPLATES;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      saveEmailTemplates(MOCK_EMAIL_TEMPLATES);
      return MOCK_EMAIL_TEMPLATES;
    }
    return JSON.parse(raw) as EmailTemplate[];
  } catch {
    return MOCK_EMAIL_TEMPLATES;
  }
}

export function saveEmailTemplates(templates: EmailTemplate[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(templates));
}

export function upsertEmailTemplate(template: EmailTemplate) {
  const list = loadEmailTemplates();
  const idx = list.findIndex((t) => t.id === template.id);
  if (idx >= 0) list[idx] = template;
  else list.unshift(template);
  saveEmailTemplates(list);
  return list;
}

export function deleteEmailTemplate(id: string) {
  const list = loadEmailTemplates().filter((t) => t.id !== id);
  saveEmailTemplates(list);
  return list;
}
