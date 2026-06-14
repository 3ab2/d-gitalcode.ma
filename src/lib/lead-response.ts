import { isDeliverableClientEmail } from "@/lib/email";

const MIN_WHATSAPP_DIGITS = 8;
const MAX_WHATSAPP_DIGITS = 15;
const BRAND_NAME = "D-GITALCODE";

export interface LeadResponseInput {
  name: string;
  email: string;
  phone?: string | null;
  serviceName?: string | null;
  serviceInterest?: string | null;
  message?: string | null;
}

export function getLeadRequestedService(lead: LeadResponseInput): string {
  return (
    lead.serviceName?.trim() ||
    lead.serviceInterest?.trim() ||
    "your inquiry"
  );
}

/** Strip and normalize a phone number for wa.me links (E.164 without +). */
export function normalizePhoneForWhatsApp(
  phone: string | null | undefined
): string | null {
  if (!phone?.trim()) return null;

  let digits = phone.replace(/\D/g, "");
  if (!digits) return null;

  if (digits.startsWith("00")) {
    digits = digits.slice(2);
  }

  // Moroccan local format: 0XXXXXXXXX → 212XXXXXXXXX
  if (digits.startsWith("0") && digits.length === 10) {
    digits = `212${digits.slice(1)}`;
  }

  // Moroccan mobile without country code (6/7XXXXXXXX)
  if (digits.length === 9 && /^[67]/.test(digits)) {
    digits = `212${digits}`;
  }

  if (digits.length < MIN_WHATSAPP_DIGITS || digits.length > MAX_WHATSAPP_DIGITS) {
    return null;
  }

  return digits;
}

export function buildLeadWhatsAppMessage(lead: LeadResponseInput): string {
  const clientName = lead.name.trim() || "there";
  const service = getLeadRequestedService(lead);

  return [
    `Hello ${clientName},`,
    "",
    `Thank you for contacting ${BRAND_NAME}.`,
    "",
    "We have received your request regarding:",
    `"${service}"`,
    "",
    "We reviewed your requirements and would be happy to discuss your project in more detail.",
    "",
    "Please let us know any additional information, budget, timeline, or specific requirements.",
    "",
    "Best regards,",
    `${BRAND_NAME} Team`,
  ].join("\n");
}

export function buildLeadEmailSubject(): string {
  return `Re: Your Request - ${BRAND_NAME}`;
}

export function buildLeadEmailBody(lead: LeadResponseInput): string {
  const clientName = lead.name.trim() || "there";
  const service = getLeadRequestedService(lead);

  return [
    `Hello ${clientName},`,
    "",
    `Thank you for contacting ${BRAND_NAME}.`,
    "",
    "We have received your request regarding:",
    `"${service}"`,
    "",
    "Our team is reviewing your requirements and we would be pleased to discuss the next steps with you.",
    "",
    "Feel free to reply with any additional details that may help us better understand your project.",
    "",
    "Best regards,",
    `${BRAND_NAME} Team`,
  ].join("\n");
}

export function buildLeadWhatsAppUrl(lead: LeadResponseInput): string | null {
  const phone = normalizePhoneForWhatsApp(lead.phone);
  if (!phone) return null;

  const message = buildLeadWhatsAppMessage(lead);
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

export function buildLeadMailtoUrl(lead: LeadResponseInput): string | null {
  if (!isDeliverableClientEmail(lead.email)) return null;

  const subject = buildLeadEmailSubject();
  const body = buildLeadEmailBody(lead);
  const recipient = lead.email.trim();

  return `mailto:${encodeURIComponent(recipient)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export function canReplyViaWhatsApp(lead: LeadResponseInput): boolean {
  return normalizePhoneForWhatsApp(lead.phone) !== null;
}

export function canReplyViaEmail(lead: LeadResponseInput): boolean {
  return isDeliverableClientEmail(lead.email);
}
