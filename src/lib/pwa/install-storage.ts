const DISMISS_KEY = "dgitalcode-pwa-dismissed-at";
const INSTALLED_KEY = "dgitalcode-pwa-installed";
const SESSION_SHOWN_KEY = "dgitalcode-pwa-modal-shown";
const DISMISS_MS = 7 * 24 * 60 * 60 * 1000;

export function isPwaDismissed(): boolean {
  if (typeof window === "undefined") return false;
  const raw = localStorage.getItem(DISMISS_KEY);
  if (!raw) return false;
  const dismissedAt = Number(raw);
  if (!Number.isFinite(dismissedAt)) return false;
  return Date.now() - dismissedAt < DISMISS_MS;
}

export function dismissPwaPrompt(): void {
  localStorage.setItem(DISMISS_KEY, String(Date.now()));
}

export function markPwaInstalled(): void {
  localStorage.setItem(INSTALLED_KEY, "1");
}

export function isPwaMarkedInstalled(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(INSTALLED_KEY) === "1";
}

export function wasPwaModalShownThisSession(): boolean {
  if (typeof window === "undefined") return false;
  return sessionStorage.getItem(SESSION_SHOWN_KEY) === "1";
}

export function markPwaModalShownThisSession(): void {
  sessionStorage.setItem(SESSION_SHOWN_KEY, "1");
}
