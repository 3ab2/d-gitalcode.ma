import { getTranslation } from "@/lib/i18n/server";
import { type Locale } from "@/lib/i18n/settings";

export default async function LocaleLoading({
  params,
}: {
  params?: Promise<{ locale: string }>;
}) {
  const locale = params ? ((await params).locale as Locale) : "fr";
  const { t } = await getTranslation(locale);

  return (
    <div
      className="flex min-h-[50vh] flex-col items-center justify-center gap-4 px-4"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <div
        className="h-10 w-10 animate-spin rounded-full border-2 border-white/15 border-t-brand-green"
        aria-hidden
      />
      <p className="text-sm text-white/50">{t("pageLoading.message")}</p>
    </div>
  );
}
