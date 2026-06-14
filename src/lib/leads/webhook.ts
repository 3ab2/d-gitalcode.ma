import { logWarn } from "@/lib/logger";

export interface LeadWebhookPayload {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  message: string;
  budgetRange?: string | null;
  sourcePage?: string | null;
  serviceInterest?: string | null;
  serviceName?: string | null;
  type: string;
  method: string;
  locale: string;
  createdAt: string;
}

export async function sendLeadWebhook(payload: LeadWebhookPayload): Promise<void> {
  const url = process.env.LEAD_WEBHOOK_URL?.trim();
  if (!url) return;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(5000),
    });

    if (!response.ok) {
      logWarn("leads-webhook", `Webhook returned ${response.status}`);
    }
  } catch (error) {
    logWarn("leads-webhook", error instanceof Error ? error.message : "Webhook failed");
  }
}
