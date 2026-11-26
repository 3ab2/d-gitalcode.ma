import { forwardRef } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "outline" | "ghost" | "whatsapp";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
  variant?: Variant;
  size?: Size;
  isLoading?: boolean;
  /** Use "span" inside a link; a <button> inside an <a> is invalid and adds a second tab stop. */
  as?: "button" | "span";
  children?: React.ReactNode;
}

const variants: Record<Variant, string> = {
  primary: "bg-action text-on-action font-semibold hover:bg-action-hover",
  secondary: "bg-accent text-white font-semibold hover:bg-accent/90",
  outline: "border border-line-strong text-ink hover:border-white/40 hover:bg-white/[0.04]",
  ghost: "text-ink-2 hover:bg-white/[0.05] hover:text-ink",
  whatsapp: "bg-action text-on-action font-semibold hover:bg-action-hover",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-3.5 text-sm",
  md: "h-11 px-5 text-[0.9375rem]",
  lg: "h-12 px-6 text-base",
};

/** Base classes, shared with links styled as buttons. */
export function buttonClasses(variant: Variant = "primary", size: Size = "md", className?: string) {
  return cn(
    "inline-flex select-none items-center justify-center gap-2 whitespace-nowrap rounded-control transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-50",
    variants[variant],
    sizes[size],
    className
  );
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", isLoading, as = "button", children, disabled, ...props }, ref) => {
    const content = (
      <>
        {isLoading ? (
          <span
            aria-hidden
            className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
          />
        ) : null}
        {children}
      </>
    );

    if (as === "span") {
      return (
        <span className={buttonClasses(variant, size, className)} {...(props as React.HTMLAttributes<HTMLSpanElement>)}>
          {content}
        </span>
      );
    }

    return (
      <button
        ref={ref}
        className={buttonClasses(variant, size, className)}
        disabled={disabled || isLoading}
        aria-busy={isLoading || undefined}
        {...props}
      >
        {content}
      </button>
    );
  }
);

Button.displayName = "Button";
