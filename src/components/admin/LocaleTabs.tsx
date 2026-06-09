"use client";

import { cn } from "@/lib/utils";

const locales = [
  { code: "fr", label: "FR" },
  { code: "en", label: "EN" },
  { code: "ar", label: "AR" },
];

interface LocaleTabsProps {
  active: string;
  onChange: (locale: string) => void;
}

export function LocaleTabs({ active, onChange }: LocaleTabsProps) {
  return (
    <div className="flex gap-1 rounded-lg border border-white/10 p-1 w-fit">
      {locales.map((l) => (
        <button
          key={l.code}
          type="button"
          onClick={() => onChange(l.code)}
          className={cn(
            "px-3 py-1.5 text-xs rounded-md transition-colors",
            active === l.code
              ? "bg-brand-green/20 text-brand-green"
              : "text-white/50 hover:text-white"
          )}
        >
          {l.label}
        </button>
      ))}
    </div>
  );
}
