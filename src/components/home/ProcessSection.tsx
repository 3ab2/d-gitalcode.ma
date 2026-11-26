import { getTranslation } from "@/lib/i18n/server";
import { type Locale } from "@/lib/i18n/settings";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ProcessSteps, type ProcessStep } from "@/components/ui/ProcessSteps";

/** The four project stages already published on the services page, in order. */
export async function ProcessSection({ locale }: { locale: Locale }) {
  const { t } = await getTranslation(locale);
  const steps = t("servicesLanding.process.steps", { returnObjects: true }) as unknown;
  if (!Array.isArray(steps) || steps.length === 0) return null;

  return (
    <section id="method" className="section-y border-t border-line bg-surface/40">
      <div className="container-site">
        <SectionHeading title={t("servicesLanding.process.title")} subtitle={t("servicesLanding.process.subtitle")} />
        <ProcessSteps steps={steps as ProcessStep[]} className="mt-14 lg:mt-20" />
      </div>
    </section>
  );
}
