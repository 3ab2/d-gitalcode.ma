import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import {
  DEFAULT_OG_IMAGE,
  getSiteUrl,
  SITE_NAME,
} from "@/lib/seo/metadata";
import { getSiteSettings } from "@/lib/settings";
import { SerwistProvider } from "@/components/providers/SerwistProvider";
import { PwaInstallProvider } from "@/components/pwa/PwaInstallProvider";
import "./globals.css";

const APP_NAME = "D-GITALCODE";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  const keywords = settings.seoKeywords
    .split(",")
    .map((k) => k.trim())
    .filter(Boolean);

  return {
  metadataBase: new URL(getSiteUrl()),
  applicationName: APP_NAME,
  title: {
    default: settings.seoTitle,
    template: "%s | D-GITALCODE",
  },
  description: settings.seoDescription,
  keywords,
  authors: [{ name: APP_NAME }],
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: APP_NAME,
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    siteName: SITE_NAME,
    description: settings.seoDescription,
    images: [
      {
        url: DEFAULT_OG_IMAGE,
        width: 512,
        height: 512,
        alt: `${SITE_NAME} — Agence digitale`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: SITE_NAME,
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

export const viewport: Viewport = {
  themeColor: "#0a0f14",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      className={`${geistSans.variable} ${geistMono.variable} h-full`}
      data-scroll-behavior="smooth"
    >
      <body className="min-h-full flex flex-col antialiased">
        <SerwistProvider>
          <PwaInstallProvider>{children}</PwaInstallProvider>
        </SerwistProvider>
      </body>
    </html>
  );
}
