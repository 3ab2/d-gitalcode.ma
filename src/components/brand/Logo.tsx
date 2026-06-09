import Image from "next/image";
import { cn } from "@/lib/utils";

const LOGO_SIZES = {
  sm: {
    mobile: "h-8 w-auto max-w-[120px]",
    desktop: "h-10 w-auto max-w-[180px]",
    sizes: "(max-width: 768px) 120px, 180px",
  },
  md: {
    mobile: "h-14 min-h-14 w-auto max-w-[220px]",
    desktop:
      "h-14 min-h-14 w-auto max-w-[220px] md:h-16 md:min-h-16 md:max-w-[300px] lg:h-[5.625rem] lg:min-h-[5.625rem] lg:max-w-[360px]",
    sizes: "(max-width: 640px) 220px, (max-width: 1024px) 300px, 360px",
  },
  lg: {
    mobile: "h-14 w-auto max-w-[180px]",
    desktop: "h-[4.5rem] w-auto max-w-[320px] lg:h-20 lg:max-w-[360px]",
    sizes: "(max-width: 768px) 180px, 360px",
  },
  login: {
    mobile: "h-20 w-auto max-w-[200px]",
    desktop: "h-24 w-auto max-w-[280px]",
    sizes: "(max-width: 768px) 200px, 280px",
  },
} as const;

type LogoVariant = "responsive" | "mobile" | "desktop";
type LogoSize = keyof typeof LOGO_SIZES;

interface LogoProps {
  variant?: LogoVariant;
  size?: LogoSize;
  className?: string;
  priority?: boolean;
}

function BrandImage({
  src,
  alt,
  className,
  sizes,
  priority,
}: {
  src: string;
  alt: string;
  className: string;
  sizes: string;
  priority?: boolean;
}) {
  return (
    <Image
      src={src}
      alt={alt}
      width={720}
      height={120}
      sizes={sizes}
      quality={75}
      priority={priority}
      draggable={false}
      className={cn("brand-logo object-contain object-left", className)}
    />
  );
}

export function Logo({
  variant = "responsive",
  size = "md",
  className,
  priority,
}: LogoProps) {
  const config = LOGO_SIZES[size];

  if (variant === "mobile") {
    return (
      <BrandImage
        src="/logo-mobile.png"
        alt="D-GITALCODE"
        className={cn(config.mobile, className)}
        sizes={config.sizes}
        priority={priority}
      />
    );
  }

  if (variant === "desktop") {
    return (
      <BrandImage
        src="/logo-desktop.png"
        alt="D-GITALCODE"
        className={cn(config.desktop, className)}
        sizes={config.sizes}
        priority={priority}
      />
    );
  }

  return (
    <span className={cn("inline-flex shrink-0 items-center", className)}>
      <BrandImage
        src="/logo-mobile.png"
        alt="D-GITALCODE"
        className={cn(config.mobile, "md:hidden")}
        sizes={config.sizes}
        priority={priority}
      />
      <BrandImage
        src="/logo-desktop.png"
        alt="D-GITALCODE"
        className={cn(config.desktop, "hidden md:block")}
        sizes={config.sizes}
        priority={priority}
      />
    </span>
  );
}
