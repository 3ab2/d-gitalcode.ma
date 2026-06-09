"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useTranslation } from "react-i18next";
import { type Locale } from "@/lib/i18n/settings";
import { isAdminRole, isClientRole } from "@/lib/roles";

export function AuthNav({ locale }: { locale: Locale }) {
  const { data: session, status } = useSession();
  const { t } = useTranslation();
  const basePath = `/${locale}`;

  if (status === "loading") return null;

  if (!session?.user) {
    return (
      <div className="flex items-center gap-2">
        <Link
          href={`${basePath}/login`}
          className="text-sm text-white/70 hover:text-brand-green transition-colors"
        >
          {t("auth.login")}
        </Link>
        <Link
          href={`${basePath}/register`}
          className="text-sm rounded-lg border border-white/15 px-3 py-1.5 text-white/80 hover:border-brand-green/40 hover:text-brand-green transition-colors"
        >
          {t("auth.register")}
        </Link>
      </div>
    );
  }

  const role = session.user.role;

  return (
    <div className="flex items-center gap-3">
      {isClientRole(role) && (
        <Link
          href={`${basePath}/messages`}
          className="text-sm text-white/70 hover:text-brand-green transition-colors"
        >
          {t("messages.title")}
        </Link>
      )}
      {isAdminRole(role) && (
        <Link
          href="/admin/messages"
          className="text-sm text-white/70 hover:text-brand-green transition-colors"
        >
          Admin
        </Link>
      )}
      <button
        type="button"
        onClick={() =>
          signOut({
            callbackUrl: isAdminRole(role) ? "/admin/login" : `${basePath}/login`,
          })
        }
        className="text-sm text-white/50 hover:text-red-400 transition-colors"
      >
        {t("auth.logout")}
      </button>
    </div>
  );
}
