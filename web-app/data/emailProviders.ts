import { EmailProviderId } from "../lib/emailConnection";

export interface EmailProviderOption {
  id: EmailProviderId;
  name: string;
  description: string;
  connectTitle: string;
  connectDescription: string;
}

export const EMAIL_PROVIDERS: EmailProviderOption[] = [
  {
    id: "gmail",
    name: "Gmail",
    description: "Connect with Google Workspace account or Gmail.",
    connectTitle: "Connect with Google",
    connectDescription:
      "You will be redirected to Google to authorize HORECA to send emails on your behalf.",
  },
  {
    id: "outlook",
    name: "Outlook",
    description: "Connect with Microsoft 365 or Outlook.com.",
    connectTitle: "Connect with Outlook",
    connectDescription:
      "You will be redirected to Microsoft to authorize HORECA to send emails on your behalf.",
  },
];

export function getEmailProvider(id: EmailProviderId) {
  return EMAIL_PROVIDERS.find((p) => p.id === id);
}
