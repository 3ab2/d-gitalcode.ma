import { cn } from "@/lib/utils";

/** Questions that open in place. Native <details>, so it works without JavaScript and with the keyboard. */
export function FaqList({ items, className }: { items: { q: string; a: string }[]; className?: string }) {
  return (
    <div className={cn("divide-y divide-line border-y border-line", className)}>
      {items.map((item) => (
        <details key={item.q} className="group py-6">
          <summary className="flex cursor-pointer list-none items-start justify-between gap-6 text-lg font-medium text-ink [&::-webkit-details-marker]:hidden">
            {item.q}
            <span
              aria-hidden
              className="mt-1 grid h-6 w-6 shrink-0 place-items-center rounded-md border border-line text-ink-2 transition-transform duration-200 group-open:rotate-45"
            >
              +
            </span>
          </summary>
          <p className="mt-4 max-w-2xl text-ink-2">{item.a}</p>
        </details>
      ))}
    </div>
  );
}
