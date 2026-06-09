import Image from "next/image";
import { Headphones, User } from "lucide-react";
import { cn, formatChatTime } from "@/lib/utils";

const SUPPORT_BRAND = "Support D-GITALCODE";

export function ChatBubble({
  content,
  createdAt,
  align,
  variant,
  author,
  supportLabel,
  avatarLabel,
  locale = "fr",
  animate = false,
}: {
  content: string;
  createdAt: string | Date;
  align: "left" | "right";
  variant: "client" | "support";
  author?: string;
  /** Client-facing support identity; defaults to Support D-GITALCODE */
  supportLabel?: string;
  avatarLabel?: string;
  locale?: string;
  animate?: boolean;
}) {
  const isRight = align === "right";
  const isSupport = variant === "support";
  const displayAuthor = isSupport ? (supportLabel ?? SUPPORT_BRAND) : author;
  const localeTag = locale === "ar" ? "ar-MA" : locale === "en" ? "en-US" : "fr-FR";

  return (
    <div
      className={cn(
        "flex w-full gap-2.5 sm:gap-3",
        animate && "support-message-animate",
        isRight ? "flex-row-reverse" : "flex-row"
      )}
    >
      <div
        className={cn(
          "flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full border shadow-sm",
          isSupport
            ? "border-brand-green/25 bg-brand-green/10"
            : "border-brand-purple/25 bg-brand-purple/10"
        )}
        aria-hidden
      >
        {isSupport ? (
          <Image
            src="/logo-mobile.png"
            alt=""
            width={28}
            height={28}
            className="h-7 w-7 object-contain"
          />
        ) : (
          <span className="flex h-full w-full items-center justify-center text-xs font-semibold text-brand-purple">
            {avatarLabel ? (
              avatarLabel.slice(0, 2).toUpperCase()
            ) : (
              <User className="h-4 w-4 text-brand-purple/80" />
            )}
          </span>
        )}
      </div>

      <div
        className={cn(
          "flex max-w-[min(82%,20rem)] flex-col gap-1 sm:max-w-[70%]",
          isRight ? "items-end" : "items-start"
        )}
      >
        {displayAuthor && (
          <p
            className={cn(
              "flex items-center gap-1.5 px-1 text-[11px] font-medium tracking-wide",
              isSupport ? "text-brand-green/90" : "text-white/45"
            )}
          >
            {isSupport && <Headphones className="h-3 w-3 shrink-0" />}
            {displayAuthor}
          </p>
        )}

        <div
          className={cn(
            "rounded-2xl px-4 py-3 shadow-md transition-shadow",
            isRight ? "rounded-br-md" : "rounded-bl-md",
            isSupport
              ? "border border-white/10 bg-white/[0.07] text-white/95 shadow-black/20"
              : "border border-brand-green/25 bg-gradient-to-br from-brand-green/25 to-brand-green/10 text-white shadow-brand-green/10"
          )}
        >
          <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">{content}</p>
        </div>

        <time
          dateTime={new Date(createdAt).toISOString()}
          className="px-1 text-[10px] text-white/35 tabular-nums"
        >
          {formatChatTime(createdAt, localeTag)}
        </time>
      </div>
    </div>
  );
}
