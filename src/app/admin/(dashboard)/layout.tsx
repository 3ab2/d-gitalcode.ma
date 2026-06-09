import { redirect } from "next/navigation";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { auth, isAdminRole } from "@/lib/auth";
import { getLoginPath } from "@/lib/auth-urls";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user || !isAdminRole(session.user.role)) {
    redirect(getLoginPath());
  }

  return (
    <>
      <AdminSidebar />
      <main className="min-h-screen pt-14 lg:ms-64 lg:pt-0 p-4 sm:p-6 lg:p-8">{children}</main>
    </>
  );
}
