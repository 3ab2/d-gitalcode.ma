import { cn } from "@/lib/utils";

/** Opening block for inner pages: page title, one lead paragraph, optional actions. */
export function PageHero({
  title,
  lead,
  children,
  className,
}: {
  title: string;
  lead?: string;
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("border-b border-line", className)}>
      <div className="container-site pt-16 pb-14 sm:pt-20 sm:pb-16 lg:pt-28 lg:pb-20">
        <h1 className="max-w-[20ch] text-title text-ink">{title}</h1>
        {lead && <p className="mt-6 max-w-2xl text-lead text-ink-2">{lead}</p>}
        {children && <div className="mt-9 flex flex-wrap gap-3">{children}</div>}
      </div>
    </section>
  );
}
