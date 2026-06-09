"use client";

import { useSession, signOut } from "next-auth/react";
import { useTranslation } from "react-i18next";
import { usePathname } from "next/navigation";
import { LogIn, UserPlus, MessageCircle, Inbox, LogOut, User } from "lucide-react";
import { type Locale } from "@/lib/i18n/settings";
import { isAdminRole, isClientRole } from "@/lib/roles";
import { getLogoutPath, getSupportPath, resolveLocaleFromPathname } from "@/lib/auth-urls";
import { IconButton } from "@/components/ui/IconButton";

export function AuthNav({ locale }: { locale: Locale }) {
  const { data: session, status } = useSession();
  const { t } = useTranslation();
  const pathname = usePathname();
  const activeLocale = locale || resolveLocaleFromPathname(pathname);
  const loginPath = `/${activeLocale}/login`;
  const registerPath = `/${activeLocale}/register`;

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

  if (isAdminRole(role)) {
    return (
      <div className="flex items-center gap-1.5">
        <IconButton href="/admin/messages" label={t("support.adminInbox")}>
          <Inbox className="h-4 w-4" />
        </IconButton>
        <IconButton
          href="/admin"
          label={session.user.name || session.user.email || "Admin"}
        >
          <User className="h-4 w-4" />
        </IconButton>
        <IconButton
          label={t("auth.logout")}
          onClick={() => signOut({ callbackUrl: getLogoutPath(activeLocale) })}
        >
          <LogOut className="h-4 w-4" />
        </IconButton>
      </div>
    );
  }

  if (isClientRole(role)) {
    return (
      <div className="flex items-center gap-1.5">
        <IconButton href={getSupportPath(activeLocale)} label={t("support.title")}>
          <MessageCircle className="h-4 w-4" />
        </IconButton>
        <IconButton
          href={getSupportPath(activeLocale)}
          label={session.user.name || session.user.email || t("auth.profile")}
        >
          <User className="h-4 w-4" />
        </IconButton>
        <IconButton
          label={t("auth.logout")}
          onClick={() => signOut({ callbackUrl: getLogoutPath(activeLocale) })}
        >
          <LogOut className="h-4 w-4" />
        </IconButton>
      </div>
    );
  }

  return null;
}
