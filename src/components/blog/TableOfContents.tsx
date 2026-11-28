"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export function TableOfContents({
  headings,
  title,
}: {
  headings: Array<{ id: string; text: string; level: number }>;
  title: string;
}) {
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target.id) setActiveId(visible.target.id);
      },
      { rootMargin: "-20% 0px -70% 0px", threshold: [0, 1] }
    );

    headings.forEach((h) => {
      const el = document.getElementById(h.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [headings]);

  if (headings.length === 0) return null;

  return (
    <nav
      aria-label={title}
      className="rounded-panel border border-line bg-surface p-4"
    >
      <p className="text-xs font-semibold text-ink-3">
        {title}
      </p>
      <ul className="mt-3 space-y-2">
        {headings.map((h) => (
          <li key={h.id}>
            <a
              href={`#${h.id}`}
              className={cn(
                "block text-sm transition-colors hover:text-ink",
                h.level === 3 && "pl-3",
                activeId === h.id ? "text-action" : "text-ink-3"
              )}
            >
              {h.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
