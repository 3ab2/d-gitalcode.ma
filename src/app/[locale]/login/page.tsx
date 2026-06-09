"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { signIn, getSession } from "next-auth/react";
import { useTranslation } from "react-i18next";
import { Logo } from "@/components/brand/Logo";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { getHomePath, getPostLoginPath } from "@/lib/auth-urls";
import { type Locale } from "@/lib/i18n/settings";

export default function LoginPage() {
  const { t } = useTranslation();
  const params = useParams();
  const searchParams = useSearchParams();
  const locale = (params.locale as Locale) || "fr";
  const basePath = `/${locale}`;
  const callbackUrl = searchParams.get("callbackUrl");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError(t("auth.invalidCredentials"));
      setLoading(false);
      return;
    }

    const session = await getSession();
    const destination = getPostLoginPath(session?.user?.role, locale);

    if (destination.startsWith("/admin")) {
      window.location.assign(destination);
      return;
    }

    if (callbackUrl && callbackUrl.startsWith("/") && !callbackUrl.startsWith("/admin")) {
      window.location.assign(callbackUrl);
      return;
    }

    window.location.assign(getHomePath(locale));
  };

  return (
    <section className="py-16 md:py-24">
      <div className="mx-auto max-w-md px-4">
        <div className="text-center mb-8">
          <Logo size="login" className="mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white">{t("auth.loginTitle")}</h1>
          <p className="text-white/50 mt-2">{t("auth.loginSubtitle")}</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-white/10 bg-white/[0.02] p-8 space-y-5"
        >
          <Input
            id="email"
            type="email"
            label={t("contact.email")}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
          <Input
            id="password"
            type="password"
            label={t("auth.password")}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <Button type="submit" isLoading={loading} className="w-full">
            {t("auth.login")}
          </Button>

          <p className="text-center text-sm text-white/50">
            {t("auth.noAccount")}{" "}
            <Link href={`${basePath}/register`} className="text-brand-green hover:underline">
              {t("auth.register")}
            </Link>
          </p>
        </form>
      </div>
    </section>
  );
}
