import { cn } from "@/lib/utils";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export function GlassCard({ children, className, hover = true }: GlassCardProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border border-white/[0.08] bg-brand-card/80 p-6 lg:bg-white/[0.03] lg:backdrop-blur-sm",
        hover &&
          "transition-all duration-300 hover:border-brand-green/20 hover:bg-white/[0.05] hover:shadow-lg hover:shadow-brand-green/5",
        className
      )}
    >
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-brand-green/[0.03] via-transparent to-brand-purple/[0.03] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      <div className="relative">{children}</div>
    </div>
  );
}
