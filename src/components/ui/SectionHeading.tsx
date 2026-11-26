import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  /** "split" puts the description beside the title on wide screens. */
  align?: "left" | "center" | "split";
  /** Use "h1" when this heading is the page title. */
  as?: "h1" | "h2";
  className?: string;
  children?: React.ReactNode;
}

export function SectionHeading({
  title,
  subtitle,
  align = "split",
  as: Heading = "h2",
  className,
  children,
}: SectionHeadingProps) {
  if (align === "center") {
    return (
      <div className={cn("mx-auto max-w-2xl text-center", className)}>
        <Heading className={Heading === "h1" ? "text-title text-ink" : "text-heading text-ink"}>{title}</Heading>
        {subtitle && <p className="mt-4 text-lead text-ink-2">{subtitle}</p>}
        {children}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "grid gap-4",
        align === "split" && "lg:grid-cols-12 lg:items-end lg:gap-10",
        className
      )}
    >
      <Heading
        className={cn(
          Heading === "h1" ? "text-title text-ink" : "text-heading text-ink",
          "max-w-[22ch]",
          align === "split" && "lg:col-span-7"
        )}
      >
        {title}
      </Heading>
      {(subtitle || children) && (
        <div className={cn("max-w-xl", align === "split" && "lg:col-span-5 lg:justify-self-end")}>
          {subtitle && <p className="text-lead text-ink-2">{subtitle}</p>}
          {children}
        </div>
      )}
    </div>
  );
}
