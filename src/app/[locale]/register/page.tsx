"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { useTranslation } from "react-i18next";
import { Logo } from "@/components/brand/Logo";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { type Locale } from "@/lib/i18n/settings";

export default function RegisterPage() {
  const { t } = useTranslation();
  const params = useParams();
  const locale = (params.locale as Locale) || "fr";
  const basePath = `/${locale}`;

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(
        data.error === "email_exists"
          ? t("auth.emailExists")
          : t("auth.registerFailed")
      );
      setLoading(false);
      return;
    }

    const signInResult = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (signInResult?.error) {
      setError(t("auth.registerSuccessLogin"));
      setLoading(false);
      return;
    }

    window.location.assign(`${basePath}/messages`);
  };

  return (
    <section className="py-16 md:py-24">
      <div className="mx-auto max-w-md px-4">
        <div className="text-center mb-8">
          <Logo size="login" className="mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white">{t("auth.registerTitle")}</h1>
          <p className="text-white/50 mt-2">{t("auth.registerSubtitle")}</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-white/10 bg-white/[0.02] p-8 space-y-5"
        >
          <Input
            id="name"
            label={t("contact.name")}
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <Input
            id="email"
            type="email"
            label={t("contact.email")}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            id="password"
            type="password"
            label={t("auth.password")}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
          />

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <Button type="submit" isLoading={loading} className="w-full">
            {t("auth.register")}
          </Button>

          <p className="text-center text-sm text-white/50">
            {t("auth.hasAccount")}{" "}
            <Link href={`${basePath}/login`} className="text-brand-green hover:underline">
              {t("auth.login")}
            </Link>
          </p>
        </form>
      </div>
    </section>
  );
}
