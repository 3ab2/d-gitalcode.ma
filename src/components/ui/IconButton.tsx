"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";

type IconButtonProps = {
  label: string;
  className?: string;
  children: React.ReactNode;
} & (
  | { href: string; onClick?: never }
  | { href?: never; onClick: () => void }
);

export function IconButton({ label, className, children, href, onClick }: IconButtonProps) {
  const classes = cn(
    "flex h-10 w-10 items-center justify-center rounded-xl border border-white/10",
    "text-white/70 transition-colors hover:border-brand-green/30 hover:bg-white/5 hover:text-brand-green",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green/50",
    className
  );

  if (href) {
    return (
      <Link href={href} className={classes} aria-label={label} title={label}>
        {children}
      </Link>
    );
  }

  return (
    <button type="button" onClick={onClick} className={classes} aria-label={label} title={label}>
      {children}
    </button>
  );
}
