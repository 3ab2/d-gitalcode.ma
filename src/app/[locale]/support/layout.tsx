import { redirect } from "next/navigation";
import { auth, isAdminRole, isClientRole } from "@/lib/auth";
import { getLoginPath } from "@/lib/auth-urls";
import { isValidLocale } from "@/lib/i18n/settings";

export default async function SupportLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!isValidLocale(locale)) {
    redirect(getLoginPath());
  }

  const session = await auth();

  if (!session?.user) {
    redirect(`${getLoginPath(locale)}?callbackUrl=/${locale}/support`);
  }

  if (isAdminRole(session.user.role)) {
    redirect("/admin/messages");
  }

  if (!isClientRole(session.user.role)) {
    redirect(getLoginPath(locale));
  }

  return <>{children}</>;
}
