import type { Metadata } from "next";
import { NOINDEX_ROBOTS } from "@/lib/seo/metadata";
import { SessionProvider } from "@/components/providers/SessionProvider";
import { NotificationProvider } from "@/components/notifications/NotificationProvider";

export const metadata: Metadata = {
  title: "Admin",
  robots: NOINDEX_ROBOTS,
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-brand-dark">
      <SessionProvider>
        <NotificationProvider>{children}</NotificationProvider>
      </SessionProvider>
    </div>
  );
}
