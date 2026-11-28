import { cn } from "@/lib/utils";

export type ProcessStep = { title: string; desc: string };

/** Ordered stages. Numbers are shown because the content is a sequence. */
export function ProcessSteps({ steps, className }: { steps: ProcessStep[]; className?: string }) {
  return (
    <ol className={cn("grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4", className)}>
      {steps.map((step, index) => (
        <li key={step.title} className="relative border-t border-line pt-8">
          <span aria-hidden className="absolute -top-px start-0 h-0.5 w-10 bg-accent" />
          <span className="block text-sm font-medium tabular-nums text-accent-ink">
            {String(index + 1).padStart(2, "0")}
          </span>
          <h3 className="mt-4 text-subheading text-ink">{step.title}</h3>
          <p className="mt-3 text-ink-2">{step.desc}</p>
        </li>
      ))}
    </ol>
  );
}
