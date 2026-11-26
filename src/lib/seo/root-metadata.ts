import type { Metadata, Viewport } from "next";
import {
  DEFAULT_OG_IMAGE,
  DEFAULT_OG_SIZE,
  getSiteUrl,
  SITE_NAME,
} from "@/lib/seo/metadata";
import { getSiteSettings } from "@/lib/settings";

/** Metadata shared by every root layout (public site, admin, offline page). */
export async function buildRootMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  const keywords = settings.seoKeywords
    .split(",")
    .map((k) => k.trim())
    .filter(Boolean);

  return {
    metadataBase: new URL(getSiteUrl()),
    applicationName: SITE_NAME,
    title: {
      default: settings.seoTitle,
      template: `%s | ${SITE_NAME}`,
    },
    description: settings.seoDescription,
    keywords,
    authors: [{ name: SITE_NAME }],
    manifest: "/manifest.webmanifest",
    appleWebApp: {
      capable: true,
      statusBarStyle: "black-translucent",
      title: SITE_NAME,
    },
    formatDetection: {
      telephone: false,
    },
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      description: settings.seoDescription,
      images: [{ url: DEFAULT_OG_IMAGE, ...DEFAULT_OG_SIZE, alt: SITE_NAME }],
    },
    twitter: {
      card: "summary_large_image",
      images: [DEFAULT_OG_IMAGE],
    },
    icons: {
      icon: [
        { url: "/favicon.ico", sizes: "48x48" },
        { url: "/icons/favicon-16x16.png", sizes: "16x16", type: "image/png" },
        { url: "/icons/favicon-32x32.png", sizes: "32x32", type: "image/png" },
        {
          url: "/icons/android-chrome-192x192.png",
          sizes: "192x192",
          type: "image/png",
        },
        {
          url: "/icons/android-chrome-512x512.png",
          sizes: "512x512",
          type: "image/png",
        },
      ],
      apple: [
        {
          url: "/icons/apple-touch-icon.png",
          sizes: "180x180",
          type: "image/png",
        },
      ],
      shortcut: ["/favicon.ico"],
    },
  };
}

export const rootViewport: Viewport = {
  themeColor: "#0a0f14",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
};
