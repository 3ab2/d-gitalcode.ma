import Image from "next/image";
import { cn } from "@/lib/utils";

interface HeroIllustrationProps {
  className?: string;
}

export function HeroIllustration({ className }: HeroIllustrationProps) {
  return (
    <div className={cn("relative mx-auto w-full max-w-md sm:max-w-lg lg:max-w-2xl", className)}>
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 h-[70%] w-[80%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-green/20 blur-[80px]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute left-[55%] top-[45%] h-[50%] w-[55%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-purple/15 blur-[60px]"
        aria-hidden
      />

      <Image
        src="/hero.png"
        alt="D-GITALCODE — Web, Mobile, WordPress & Plugins"
        width={1200}
        height={900}
        sizes="(max-width: 640px) 88vw, (max-width: 1024px) 52vw, 640px"
        quality={88}
        priority
        draggable={false}
        className="brand-hero-illustration relative z-[1] h-auto w-full"
      />
    </div>
  );
}
