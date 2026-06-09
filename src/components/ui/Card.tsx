"use client";

import { cn } from "@/lib/utils";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export function Card({ children, className, hover = true }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-white/10 bg-white/[0.03] p-6",
        hover && "transition-colors duration-300 hover:border-brand-green/20 hover:bg-white/[0.05]",
        className
      )}
    >
      {children}
    </div>
  );
}
