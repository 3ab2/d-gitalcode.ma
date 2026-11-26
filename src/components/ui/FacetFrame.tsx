import { cn } from "@/lib/utils";

/**
 * A frame with one corner cut at 45 degrees, after the cuts in the logo mark.
 * The 1px edge follows the cut because the border is the outer layer's background.
 */
export function FacetFrame({
  children,
  className,
  innerClassName,
  size = "md",
}: {
  children: React.ReactNode;
  className?: string;
  innerClassName?: string;
  size?: "sm" | "md" | "lg";
}) {
  const facet = { sm: "[--facet:0.875rem]", md: "[--facet:1.25rem]", lg: "[--facet:2rem]" }[size];
  return (
    <div className={cn("facet bg-line-strong p-px", facet, className)}>
      <div className={cn("facet relative h-full overflow-hidden bg-surface", facet, innerClassName)}>{children}</div>
    </div>
  );
}
