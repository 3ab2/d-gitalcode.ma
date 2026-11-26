import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "green" | "purple" | "default";
  className?: string;
}

export function Badge({ children, variant = "default", className }: BadgeProps) {
  const variants = {
    green: "bg-brand-green/10 text-brand-green border-brand-green/20",
    purple: "bg-brand-purple/10 text-[#b3a6fa] border-brand-purple/20",
    default: "bg-white/5 text-white/70 border-white/10",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
