"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/utils";
import { fieldClassName, labelClassName } from "@/components/ui/Input";

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(({ className, label, error, id, ...props }, ref) => (
  <div className="space-y-2">
    {label && (
      <label htmlFor={id} className={labelClassName}>
        {label}
      </label>
    )}
    <textarea
      ref={ref}
      id={id}
      aria-invalid={error ? true : undefined}
      aria-describedby={error && id ? `${id}-error` : undefined}
      className={cn(fieldClassName, "resize-y", error && "border-red-400/70", className)}
      {...props}
    />
    {error && (
      <p id={id ? `${id}-error` : undefined} className="text-sm text-red-300">
        {error}
      </p>
    )}
  </div>
));

Textarea.displayName = "Textarea";
