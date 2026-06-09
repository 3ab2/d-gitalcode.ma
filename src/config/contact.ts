export const CONTACT_EMAIL = "3ab2uelkarch2006@gmail.com";

/** Verified Resend sending domain */
export const EMAIL_DOMAIN = "d-igitalcode.ma";

export const EMAIL_FROM_ADDRESS = `noreply@${EMAIL_DOMAIN}`;

/** Production sender — requires DNS verification in Resend */
export const EMAIL_FROM_DEFAULT = `D-GITALCODE <${EMAIL_FROM_ADDRESS}>`;

/** Fallback while domain is pending verification */
export const EMAIL_FROM_TEST = "D-GITALCODE <onboarding@resend.dev>";

export const INVALID_CLIENT_EMAILS = new Set([
  "whatsapp@redirect.local",
  "noreply@local",
]);
