import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { auth, isAdminRole, isClientRole } from "@/lib/auth";
import { getLoginPath, getSupportPath, resolveLocaleFromCookie } from "@/lib/auth-urls";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect(getLoginPath());
  }

  if (!isAdminRole(session.user.role)) {
    if (isClientRole(session.user.role)) {
      const cookieStore = await cookies();
      const locale = resolveLocaleFromCookie(cookieStore.get("NEXT_LOCALE")?.value);
      redirect(getSupportPath(locale));
    }
    redirect(getLoginPath());
  }

  return (
    <>
      <AdminSidebar />
      <main className="min-h-screen pt-14 lg:ms-64 lg:pt-0 p-4 sm:p-6 lg:p-8">{children}</main>
    </>
  );
}
