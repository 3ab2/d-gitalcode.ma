import { redirect } from "next/navigation";
import { auth, isAdminRole, isClientRole } from "@/lib/auth";
import { isValidLocale, type Locale } from "@/lib/i18n/settings";

export default async function MessagesLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!isValidLocale(locale)) {
    redirect("/fr/login");
  }

  const session = await auth();

  if (!session?.user) {
    redirect(`/${locale}/login?callbackUrl=/${locale}/messages`);
  }

  if (isAdminRole(session.user.role)) {
    redirect("/admin/messages");
  }

  if (!isClientRole(session.user.role)) {
    redirect(`/${locale}/login`);
  }

  return <>{children}</>;
}
