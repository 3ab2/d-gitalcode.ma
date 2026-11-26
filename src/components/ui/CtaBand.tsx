import { cn } from "@/lib/utils";
import { FacetFrame } from "@/components/ui/FacetFrame";

/** Closing call to action for a page: one question, one sentence, the actions. */
export function CtaBand({
  title,
  subtitle,
  children,
  className,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("section-y border-t border-line", className)}>
      <div className="container-site">
        <FacetFrame size="lg" innerClassName="bg-surface">
          <div className="grid gap-8 p-8 sm:p-12 lg:grid-cols-12 lg:items-end lg:p-16">
            <div className="lg:col-span-8">
              <h2 className="max-w-[20ch] text-heading text-ink">{title}</h2>
              {subtitle && <p className="mt-4 max-w-xl text-lead text-ink-2">{subtitle}</p>}
            </div>
            <div className="flex flex-col gap-3 sm:flex-row lg:col-span-4 lg:justify-end">{children}</div>
          </div>
        </FacetFrame>
      </div>
    </section>
  );
}
