import {
  CONTACT_EMAIL,
  EMAIL_DOMAIN,
  EMAIL_FROM_DEFAULT,
} from "@/config/contact";
import { isDeliverableClientEmail } from "@/lib/email-validation";
import { Resend } from "resend";

export { isDeliverableClientEmail } from "@/lib/email-validation";

function getResendApiKey(): string | null {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) return null;

  const isPlaceholder =
    apiKey.includes("xxxx") ||
    apiKey === "re_" ||
    /your_.*key/i.test(apiKey) ||
    apiKey.length < 24;

  if (isPlaceholder || !/^re_[A-Za-z0-9_]+$/.test(apiKey)) {
    return null;
  }

  return apiKey;
}

function getResendClient(): Resend | null {
  const apiKey = getResendApiKey();
  return apiKey ? new Resend(apiKey) : null;
}

/** Verified sender — never use the client's email as From */
function getEmailFrom(): string {
  return process.env.EMAIL_FROM?.trim() || EMAIL_FROM_DEFAULT;
}

function getAdminNotifyEmail(): string {
  return (
    process.env.ADMIN_EMAIL_NOTIFY?.trim() ||
    process.env.ADMIN_EMAIL?.trim() ||
    CONTACT_EMAIL
  );
}

export function isResendConfigured(): boolean {
  return getResendClient() !== null;
}

export type EmailSendResult =
  | { success: true; id?: string }
  | {
      success: false;
      reason: "not_configured" | "invalid_recipient" | "send_failed";
      error?: string;
    };

interface ContactEmailData {
  name: string;
  email: string;
  phone?: string;
  message: string;
  serviceName?: string;
  serviceInterest?: string;
  budgetRange?: string;
  sourcePage?: string;
  type: string;
}

export async function sendContactNotification(
  data: ContactEmailData,
  options?: { notifyEmail?: string }
): Promise<EmailSendResult> {
  const client = getResendClient();
  const adminEmail = options?.notifyEmail?.trim() || getAdminNotifyEmail();

  if (!client) {
    console.warn("[email] RESEND_API_KEY missing or invalid — skipping notification");
    return { success: false, reason: "not_configured" };
  }

  const subject = data.serviceName
    ? `[D-GITALCODE] Service Request: ${data.serviceName}`
    : `[D-GITALCODE] New Contact Message`;

  const html = `
    <h2>New ${data.type === "SERVICE_REQUEST" ? "Service Request" : "Contact"} Message</h2>
    <p><strong>Name:</strong> ${escapeHtml(data.name)}</p>
    <p><strong>Email:</strong> ${escapeHtml(data.email)}</p>
    ${data.phone ? `<p><strong>Phone:</strong> ${escapeHtml(data.phone)}</p>` : ""}
    ${data.serviceName ? `<p><strong>Service:</strong> ${escapeHtml(data.serviceName)}</p>` : ""}
    ${data.serviceInterest ? `<p><strong>Interest:</strong> ${escapeHtml(data.serviceInterest)}</p>` : ""}
    ${data.budgetRange ? `<p><strong>Budget:</strong> ${escapeHtml(data.budgetRange)}</p>` : ""}
    ${data.sourcePage ? `<p><strong>Source:</strong> ${escapeHtml(data.sourcePage)}</p>` : ""}
    <p><strong>Message:</strong></p>
    <p>${escapeHtml(data.message).replace(/\n/g, "<br>")}</p>
  `;

  const { data: result, error } = await client.emails.send({
    from: getEmailFrom(),
    to: adminEmail,
    replyTo: data.email,
    subject,
    html,
  });

  if (error) {
    console.error("[email] Contact notification failed:", error);
    return {
      success: false,
      reason: "send_failed",
      error: formatResendError(error),
    };
  }

  return { success: true, id: result?.id };
}

function formatResendError(error: {
  message?: string;
  statusCode?: number | null;
}): string {
  const message = error.message ?? JSON.stringify(error);
  if (error.statusCode === 403 && message.includes("verify a domain")) {
    return `${message} Configure EMAIL_FROM with a verified domain (e.g. noreply@${EMAIL_DOMAIN}) in Resend. See docs/RESEND-DNS.md.`;
  }
  return message;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
