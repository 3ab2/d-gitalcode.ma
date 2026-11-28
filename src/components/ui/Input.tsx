"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/utils";

/** Shared look for text fields and selects. */
export const fieldClassName =
  "w-full rounded-control border border-line-strong bg-bg px-4 py-3 text-base text-ink placeholder:text-ink-3 transition-colors hover:border-white/25 focus:border-action focus:outline-none focus:ring-2 focus:ring-action/25";

export const labelClassName = "block text-sm font-medium text-ink";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({ className, label, error, id, ...props }, ref) => (
  <div className="space-y-2">
    {label && (
      <label htmlFor={id} className={labelClassName}>
        {label}
      </label>
    )}
    <input
      ref={ref}
      id={id}
      aria-invalid={error ? true : undefined}
      aria-describedby={error && id ? `${id}-error` : undefined}
      className={cn(fieldClassName, error && "border-red-400/70", className)}
      {...props}
    />
    {error && (
      <p id={id ? `${id}-error` : undefined} className="text-sm text-red-300">
        {error}
      </p>
    )}
  </div>
));

Input.displayName = "Input";
