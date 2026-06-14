import { redirect } from "next/navigation";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { PublicSettingsProvider } from "@/components/providers/PublicSettingsProvider";
import { auth, isAdminRole } from "@/lib/auth";
import { getAdminLoginPath } from "@/lib/auth-urls";
import { getSiteSettings } from "@/lib/settings";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user || !isAdminRole(session.user.role)) {
    redirect(getAdminLoginPath());
  }

  const siteSettings = await getSiteSettings();

  return (
    <PublicSettingsProvider settings={siteSettings}>
      <AdminSidebar />
      <main className="min-h-screen pt-14 lg:ms-64 lg:pt-0 p-4 sm:p-6 lg:p-8">{children}</main>
    </PublicSettingsProvider>
  );
}
