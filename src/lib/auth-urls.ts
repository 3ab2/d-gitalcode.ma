const PRODUCTION_FALLBACK = "https://d-gitalcodema.vercel.app";

/** Server-side canonical app origin (never localhost in production). */
export function getAuthBaseUrl(): string {
  const candidates = [
    process.env.AUTH_URL,
    process.env.NEXTAUTH_URL,
    process.env.NEXT_PUBLIC_SITE_URL,
    process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined,
  ];

  for (const value of candidates) {
    if (!value?.trim()) continue;
    if (value.includes("localhost")) continue;
    return value.replace(/\/$/, "");
  }

  return PRODUCTION_FALLBACK;
}

export function getAdminLoginPath(): string {
  return "/admin/login";
}

export function getAdminDashboardPath(): string {
  return "/admin";
}

export function getLogoutPath(): string {
  return getAdminLoginPath();
}
