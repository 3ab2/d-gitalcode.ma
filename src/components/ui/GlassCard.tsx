import { cn } from "@/lib/utils";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

/** Kept for existing pages; renders the same surface panel as Card. */
export function GlassCard({ children, className, hover = true }: GlassCardProps) {
  return (
    <div
      className={cn(
        "relative rounded-panel border border-line bg-surface p-6",
        hover && "transition-colors duration-200 hover:border-line-strong",
        className
      )}
    >
      {children}
    </div>
  );
}
