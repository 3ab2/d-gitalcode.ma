import { Suspense } from "react";
import { redirect } from "next/navigation";
import { auth, isAdminRole, isClientRole } from "@/lib/auth";
import { isValidLocale } from "@/lib/i18n/settings";

async function LoginGuard({
  children,
  locale,
}: {
  children: React.ReactNode;
  locale: string;
}) {
  const session = await auth();

  if (session?.user) {
    if (isAdminRole(session.user.role)) {
      redirect("/admin");
    }
    if (isClientRole(session.user.role) && isValidLocale(locale)) {
      redirect(`/${locale}`);
    }
  }

  return <>{children}</>;
}

export default async function LoginLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <Suspense fallback={null}>
      <LoginGuard locale={locale}>{children}</LoginGuard>
    </Suspense>
  );
}
