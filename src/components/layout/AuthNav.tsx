"use client";

import { useSession } from "next-auth/react";
import { logoutToLogin } from "@/lib/auth-client";
import { useTranslation } from "react-i18next";
import { usePathname } from "next/navigation";
import { LogIn, UserPlus, MessageCircle, Inbox } from "lucide-react";
import { type Locale } from "@/lib/i18n/settings";
import { isAdminRole, isClientRole } from "@/lib/roles";
import { getSupportPath, resolveLocaleFromPathname } from "@/lib/auth-urls";
import { IconButton } from "@/components/ui/IconButton";
import { NotificationBell } from "@/components/notifications/NotificationBell";
import { UserMenu } from "@/components/pwa/UserMenu";

export function AuthNav({ locale }: { locale: Locale }) {
  const { data: session, status } = useSession();
  const { t } = useTranslation();
  const pathname = usePathname();
  const activeLocale = locale || resolveLocaleFromPathname(pathname);
  const loginPath = `/${activeLocale}/login`;
  const registerPath = `/${activeLocale}/register`;
  const localeTag =
    activeLocale === "ar" ? "ar-MA" : activeLocale === "en" ? "en-US" : "fr-FR";

  if (status === "loading") {
    return <div className="h-10 w-10" aria-hidden />;
  }

  if (!session?.user) {
    return (
      <div className="flex items-center gap-1.5">
        <IconButton href={loginPath} label={t("auth.login")}>
          <LogIn className="h-4 w-4" />
        </IconButton>
        <IconButton href={registerPath} label={t("auth.register")}>
          <UserPlus className="h-4 w-4" />
        </IconButton>
      </div>
    );
  }

  const role = session.user.role;
  const displayName =
    session.user.name || session.user.email || t("auth.profile");

  if (isAdminRole(role)) {
    return (
      <div className="flex items-center gap-1.5">
        <NotificationBell localeTag={localeTag} />
        <IconButton href="/admin/messages" label={t("support.adminInbox")}>
          <Inbox className="h-4 w-4" />
        </IconButton>
        <UserMenu
          label={displayName}
          profileHref="/admin"
          onLogout={() => logoutToLogin(activeLocale)}
        />
      </div>
    );
  }

  if (isClientRole(role)) {
    return (
      <div className="flex items-center gap-1.5">
        <NotificationBell localeTag={localeTag} />
        <IconButton href={getSupportPath(activeLocale)} label={t("support.title")}>
          <MessageCircle className="h-4 w-4" />
        </IconButton>
        <UserMenu
          label={displayName}
          profileHref={getSupportPath(activeLocale)}
          onLogout={() => logoutToLogin(activeLocale)}
        />
      </div>
    );
  }

  return null;
}
