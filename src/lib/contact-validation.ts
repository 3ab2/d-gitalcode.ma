import { z } from "zod";

export const BUDGET_RANGES = [
  "under_500",
  "500_2000",
  "2000_5000",
  "5000_plus",
  "not_sure",
] as const;

export type BudgetRange = (typeof BUDGET_RANGES)[number];

export const MIN_SUBMIT_MS = 3_000;
export const MAX_FORM_AGE_MS = 3_600_000;
export const DUPLICATE_WINDOW_MS = 10 * 60 * 1000;

const baseContactFields = {
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(100),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Invalid email address")
    .max(254),
  phone: z.string().trim().max(30).optional().or(z.literal("")),
  message: z
    .string()
    .trim()
    .min(10, "Message must be at least 10 characters")
    .max(5000),
  budgetRange: z.enum(BUDGET_RANGES).optional().or(z.literal("")),
  serviceInterest: z.string().trim().max(200).optional().or(z.literal("")),
  sourcePage: z.string().trim().max(500).optional().or(z.literal("")),
  locale: z.enum(["fr", "en", "ar"]).default("fr"),
  type: z.enum(["GENERAL", "SERVICE_REQUEST"]).default("GENERAL"),
  method: z.enum(["FORM", "WHATSAPP"]).default("FORM"),
  serviceId: z.string().cuid().optional(),
  serviceName: z.string().trim().max(200).optional(),
};

/** Client-side form validation (honeypot validated server-side only). */
export const contactFormSchema = z.object(baseContactFields);

/** Server-side submission validation with anti-spam fields. */
export const contactSubmissionSchema = contactFormSchema.extend({
  /** Honeypot — must stay empty for legitimate users. */
  website: z.string().max(0).optional(),
  formLoadedAt: z.number().int().positive().optional(),
});

export type ContactFormInput = z.infer<typeof contactFormSchema>;
export type ContactSubmissionInput = z.infer<typeof contactSubmissionSchema>;

/** Client-only fields shown in the contact form UI. */
export const contactFormClientSchema = z.object({
  name: baseContactFields.name,
  email: baseContactFields.email,
  phone: baseContactFields.phone,
  message: baseContactFields.message,
  budgetRange: baseContactFields.budgetRange,
  serviceInterest: baseContactFields.serviceInterest,
  website: z.string().max(0).optional(),
});

export type ContactFormClientInput = z.infer<typeof contactFormClientSchema>;

export function isHoneypotTriggered(website: unknown): boolean {
  return typeof website === "string" && website.trim().length > 0;
}

export function isSubmitTooFast(formLoadedAt: number | undefined): boolean {
  if (!formLoadedAt) return false;
  return Date.now() - formLoadedAt < MIN_SUBMIT_MS;
}

export function isFormExpired(formLoadedAt: number | undefined): boolean {
  if (!formLoadedAt) return false;
  return Date.now() - formLoadedAt > MAX_FORM_AGE_MS;
}

export function normalizeContactPayload(data: ContactSubmissionInput) {
  return {
    name: data.name,
    email: data.email,
    phone: data.phone?.trim() || null,
    message: data.message,
    budgetRange: data.budgetRange?.trim() || null,
    sourcePage: data.sourcePage?.trim() || null,
    serviceInterest: data.serviceInterest?.trim() || null,
    locale: data.locale,
    type: data.type,
    method: data.method,
    serviceId: data.serviceId ?? null,
    serviceName: data.serviceName?.trim() || null,
  };
}
