import { cn } from "@/lib/utils";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

/** A plain surface panel. Use for grouped content; prefer open layouts with rules for lists. */
export function Card({ children, className, hover = false }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-panel border border-line bg-surface p-6",
        hover && "transition-colors duration-200 hover:border-line-strong",
        className
      )}
    >
      {children}
    </div>
  );
}
