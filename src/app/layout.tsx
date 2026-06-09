import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SessionProvider } from "@/components/providers/SessionProvider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "D-GITALCODE — Agence Digitale & Solutions WooCommerce",
    template: "%s | D-GITALCODE",
  },
  description:
    "Agence digitale spécialisée en développement web, applications mobiles, plugins WooCommerce et solutions eCommerce intelligentes.",
  keywords: [
    "développement web",
    "WooCommerce",
    "WhatsApp",
    "WordPress plugins",
    "agence digitale Maroc",
  ],
  authors: [{ name: "D-GITALCODE" }],
  openGraph: {
    type: "website",
    locale: "fr_FR",
    siteName: "D-GITALCODE",
  },
  icons: {
    icon: "/logo-mobile.png",
    apple: "/logo-mobile.png",
  },
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
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
