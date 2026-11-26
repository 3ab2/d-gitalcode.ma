import type { Metadata } from "next";
import { RootShell } from "@/components/layout/RootShell";
import { NOINDEX_ROBOTS } from "@/lib/seo/metadata";
import { buildRootMetadata, rootViewport } from "@/lib/seo/root-metadata";
import { getMessages } from "@/lib/i18n/server";
import { I18nProvider } from "@/components/providers/I18nProvider";
import { SessionProvider } from "@/components/providers/SessionProvider";
import { NotificationProvider } from "@/components/notifications/NotificationProvider";

export const viewport = rootViewport;

export async function generateMetadata(): Promise<Metadata> {
  return {
    ...(await buildRootMetadata()),
    title: { default: "Admin | D-GITALCODE", template: "%s | D-GITALCODE" },
    robots: NOINDEX_ROBOTS,
  };
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const messages = await getMessages("en");

  return (
    <RootShell lang="en">
      <div className="min-h-screen bg-brand-dark">
        <I18nProvider locale="en" messages={messages}>
          <SessionProvider>
            <NotificationProvider>{children}</NotificationProvider>
          </SessionProvider>
        </I18nProvider>
      </div>
    </RootShell>
  );
}
