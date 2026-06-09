import { redirect } from "next/navigation";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { auth } from "@/lib/auth";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user || (session.user as { role?: string }).role !== "ADMIN") {
    redirect("/admin/login");
  }

  return (
    <>
      <AdminSidebar />
      <main className="ms-64 min-h-screen p-8">{children}</main>
    </>
  );
}
