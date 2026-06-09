import Link from "next/link";
import { getTranslation } from "@/lib/i18n/server";
import { type Locale } from "@/lib/i18n/settings";

export default async function NotFound({
  params,
}: {
  params?: Promise<{ locale: string }>;
}) {
  const locale = params ? (await params).locale : "fr";
  const { t } = await getTranslation(locale as Locale);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center px-4">
      <h1 className="text-6xl font-bold text-brand-green">404</h1>
      <p className="mt-4 text-xl text-white/70">{t("notFound.title")}</p>
      <Link
        href={`/${locale}`}
        className="mt-8 text-brand-green hover:underline"
      >
        {t("notFound.back")}
      </Link>
    </div>
  );
}
