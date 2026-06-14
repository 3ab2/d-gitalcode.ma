import type { Metadata } from "next";
import { NOINDEX_ROBOTS } from "@/lib/seo/metadata";
import { getMessages } from "@/lib/i18n/server";
import { I18nProvider } from "@/components/providers/I18nProvider";
import { SessionProvider } from "@/components/providers/SessionProvider";
import { NotificationProvider } from "@/components/notifications/NotificationProvider";

export const metadata: Metadata = {
  title: "Admin",
  robots: NOINDEX_ROBOTS,
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const messages = await getMessages("en");

  return (
    <div className="min-h-screen bg-brand-dark">
      <I18nProvider locale="en" messages={messages}>
        <SessionProvider>
          <NotificationProvider>{children}</NotificationProvider>
        </SessionProvider>
      </I18nProvider>
    </div>
  );
}
