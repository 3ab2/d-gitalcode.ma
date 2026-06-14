import { INVALID_CLIENT_EMAILS } from "@/config/contact";

/** Client-safe email validation — no server-only dependencies. */
export function isDeliverableClientEmail(email: string): boolean {
  const normalized = email.trim().toLowerCase();
  if (INVALID_CLIENT_EMAILS.has(normalized)) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized);
}
