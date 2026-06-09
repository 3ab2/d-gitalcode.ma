import { cn } from "@/lib/utils";
import { type LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  color?: "green" | "purple" | "default";
}

export function StatCard({ title, value, icon: Icon, trend, color = "default" }: StatCardProps) {
  const colors = {
    green: "bg-brand-green/10 text-brand-green",
    purple: "bg-brand-purple/10 text-brand-purple",
    default: "bg-white/5 text-white/70",
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-white/50">{title}</p>
          <p className="mt-2 text-3xl font-bold text-white">{value}</p>
          {trend && <p className="mt-1 text-xs text-white/40">{trend}</p>}
        </div>
        <div className={cn("flex h-12 w-12 items-center justify-center rounded-xl", colors[color])}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  );
}
