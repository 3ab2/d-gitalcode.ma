"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { type Locale } from "@/lib/i18n/settings";

export default function NewMessagePage() {
  const { t } = useTranslation();
  const params = useParams();
  const router = useRouter();
  const locale = (params.locale as Locale) || "fr";
  const basePath = `/${locale}`;

  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        subject: subject || undefined,
        content,
      }),
    });

    if (!res.ok) {
      setError(t("messages.sendFailed"));
      setLoading(false);
      return;
    }

    router.push(`${basePath}/messages`);
    router.refresh();
  };

  return (
    <section className="py-10 pb-16">
      <div className="mx-auto max-w-xl px-4 sm:px-6">
        <div className="mb-8">
          <Link
            href={`${basePath}/messages`}
            className="text-sm text-white/50 hover:text-brand-green transition-colors"
          >
            ← {t("messages.back")}
          </Link>
          <h1 className="text-2xl font-bold text-white mt-4">{t("messages.newTitle")}</h1>
          <p className="text-sm text-white/50 mt-1">{t("messages.newSubtitle")}</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 space-y-5"
        >
          <Input
            id="subject"
            label={t("messages.subject")}
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder={t("messages.subjectPlaceholder")}
          />
          <Textarea
            id="content"
            label={t("messages.content")}
            rows={6}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            minLength={5}
          />

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <div className="flex gap-3">
            <Button type="submit" isLoading={loading}>
              {t("messages.send")}
            </Button>
            <Link href={`${basePath}/messages`}>
              <Button type="button" variant="outline">
                {t("messages.cancel")}
              </Button>
            </Link>
          </div>
        </form>
      </div>
    </section>
  );
}
