import Image from "next/image";
import { cn } from "@/lib/utils";

/*
 * Logo artwork comes unchanged from the approved files (public/logo-mobile.png, public/logo-desktop.png),
 * cropped to their visible area in public/brand/ so they render at a readable size.
 * The horizontal arrangement places the approved mark beside the approved wordmark.
 */
const MARK = { src: "/brand/logo-mark.png", width: 256, height: 265 };
const WORDMARK = { src: "/brand/logo-wordmark.png", width: 983, height: 96 };
const STACKED = { src: "/brand/logo-full.png", width: 640, height: 323 };

const SIZES = {
  sm: { mark: "h-7", word: "h-[0.6875rem]", stacked: "h-14" },
  md: { mark: "h-8", word: "h-[0.8125rem]", stacked: "h-16" },
  lg: { mark: "h-10", word: "h-4", stacked: "h-20" },
  login: { mark: "h-12", word: "h-5", stacked: "h-24" },
} as const;

type LogoVariant = "responsive" | "mobile" | "desktop";
type LogoSize = keyof typeof SIZES;

interface LogoProps {
  /** responsive: mark and wordmark side by side; mobile: mark only; desktop: stacked logo. */
  variant?: LogoVariant;
  size?: LogoSize;
  className?: string;
  priority?: boolean;
}

export function Logo({ variant = "responsive", size = "md", className, priority }: LogoProps) {
  const s = SIZES[size];

  if (variant === "desktop") {
    return (
      <Image
        {...STACKED}
        alt="D-GITALCODE"
        priority={priority}
        draggable={false}
        sizes="320px"
        className={cn("brand-logo w-auto", s.stacked, className)}
      />
    );
  }

  if (variant === "mobile") {
    return (
      <Image
        {...MARK}
        alt="D-GITALCODE"
        priority={priority}
        draggable={false}
        sizes="64px"
        className={cn("brand-logo w-auto", s.mark, className)}
      />
    );
  }

  return (
    <span className={cn("inline-flex shrink-0 items-center gap-3", className)} role="img" aria-label="D-GITALCODE">
      <Image {...MARK} alt="" priority={priority} draggable={false} sizes="64px" className={cn("brand-logo w-auto", s.mark)} />
      <Image {...WORDMARK} alt="" priority={priority} draggable={false} sizes="240px" className={cn("brand-logo w-auto", s.word)} />
    </span>
  );
}
