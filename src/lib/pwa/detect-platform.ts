import { isPwaMarkedInstalled } from "./install-storage";

export type PwaInstallPlatform = "android" | "ios" | "desktop" | "unsupported";

/** True when running as an installed PWA (iOS standalone, display-mode, or marked). */
export function isPwaInstalled(): boolean {
  if (typeof window === "undefined") return false;
  return (
    isPwaMarkedInstalled() ||
    window.matchMedia("(display-mode: standalone)").matches ||
    window.matchMedia("(display-mode: fullscreen)").matches ||
    (window.navigator as Navigator & { standalone?: boolean }).standalone === true
  );
}

/** iPhone, iPad, or iPod — includes iPadOS desktop UA. */
export function isIosDevice(): boolean {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent;
  if (/iPhone|iPod/.test(ua)) return true;
  if (/iPad/.test(ua)) return true;
  return navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1;
}

/**
 * Safari on iOS/iPadOS (excludes Chrome, Firefox, Edge wrappers on iOS).
 * These browsers use WebKit but do not fire `beforeinstallprompt`.
 */
export function isIosSafari(): boolean {
  if (!isIosDevice()) return false;
  const ua = navigator.userAgent;
  if (/CriOS|FxiOS|EdgiOS|OPiOS|DuckDuckGo/.test(ua)) return false;
  return /Safari/i.test(ua) && !/Chrome|Chromium/i.test(ua);
}

export function isAndroidDevice(): boolean {
  if (typeof navigator === "undefined") return false;
  return /Android/i.test(navigator.userAgent);
}

export function detectPwaInstallPlatform(): PwaInstallPlatform {
  if (typeof window === "undefined") return "unsupported";
  if (isPwaInstalled()) return "unsupported";
  if (isIosSafari()) return "ios";
  if (isAndroidDevice()) return "android";
  return "desktop";
}
