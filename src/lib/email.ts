import {
  CONTACT_EMAIL,
  EMAIL_DOMAIN,
  EMAIL_FROM_DEFAULT,
  INVALID_CLIENT_EMAILS,
} from "@/config/contact";
import { Resend } from "resend";

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

export function isDeliverableClientEmail(email: string): boolean {
  const normalized = email.trim().toLowerCase();
  if (INVALID_CLIENT_EMAILS.has(normalized)) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized);
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
    <p><strong>Name:</strong> ${data.name}</p>
    <p><strong>Email:</strong> ${data.email}</p>
    ${data.phone ? `<p><strong>Phone:</strong> ${data.phone}</p>` : ""}
    ${data.serviceName ? `<p><strong>Service:</strong> ${data.serviceName}</p>` : ""}
    <p><strong>Message:</strong></p>
    <p>${data.message.replace(/\n/g, "<br>")}</p>
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

interface ReplyEmailData {
  to: string;
  subject: string;
  message: string;
  clientName: string;
}

export async function sendReplyEmail(
  data: ReplyEmailData
): Promise<EmailSendResult> {
  const client = getResendClient();
  const clientEmail = data.to.trim();

  if (!client) {
    console.error("[email] Reply aborted — RESEND_API_KEY not configured");
    return { success: false, reason: "not_configured" };
  }

  if (!isDeliverableClientEmail(clientEmail)) {
    const error = `Invalid or placeholder client email: ${clientEmail}`;
    console.error("[email] Reply aborted —", error);
    return { success: false, reason: "invalid_recipient", error };
  }

  const html = `
    <p>Bonjour ${escapeHtml(data.clientName)},</p>
    <div>${data.message.replace(/\n/g, "<br>")}</div>
    <br>
    <p>— L'équipe D-GITALCODE</p>
    <p style="color:#888;font-size:12px;">Répondez à cet email pour contacter notre équipe.</p>
  `;

  const from = getEmailFrom();
  const replyTo = getAdminNotifyEmail();

  console.info("[email] Sending admin reply", {
    from,
    to: clientEmail,
    replyTo,
    subject: data.subject,
  });

  const { data: result, error } = await client.emails.send({
    from,
    to: clientEmail,
    replyTo,
    subject: data.subject,
    html,
  });

  if (error) {
    const errorInfo = formatResendError(error);
    console.error("[email] Admin reply failed:", {
      to: clientEmail,
      from,
      error: errorInfo,
      raw: error,
    });
    return {
      success: false,
      reason: "send_failed",
      error: errorInfo,
    };
  }

  console.info("[email] Admin reply sent", {
    to: clientEmail,
    id: result?.id,
  });

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
