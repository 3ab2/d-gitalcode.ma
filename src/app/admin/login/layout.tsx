import type { Metadata } from "next";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { auth, isAdminRole } from "@/lib/auth";
import { getAdminDashboardPath } from "@/lib/auth-urls";
import { NOINDEX_ROBOTS } from "@/lib/seo/metadata";

export const metadata: Metadata = {
  title: "Admin Login",
  robots: NOINDEX_ROBOTS,
};

async function AdminLoginGuard({ children }: { children: React.ReactNode }) {
  const session = await auth();

  if (session?.user && isAdminRole(session.user.role)) {
    redirect(getAdminDashboardPath());
  }

  return <>{children}</>;
}

export default function AdminLoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={null}>
      <AdminLoginGuard>{children}</AdminLoginGuard>
    </Suspense>
  );
}
