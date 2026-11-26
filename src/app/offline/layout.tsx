import type { Metadata } from "next";
import { RootShell } from "@/components/layout/RootShell";
import { NOINDEX_ROBOTS } from "@/lib/seo/metadata";
import { buildRootMetadata, rootViewport } from "@/lib/seo/root-metadata";
import { defaultLocale } from "@/lib/i18n/settings";

export const viewport = rootViewport;

export async function generateMetadata(): Promise<Metadata> {
  return { ...(await buildRootMetadata()), robots: NOINDEX_ROBOTS };
}

export default function OfflineLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <RootShell lang={defaultLocale}>{children}</RootShell>;
}
