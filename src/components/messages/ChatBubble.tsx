import { cn } from "@/lib/utils";
import { formatDate } from "@/lib/utils";

export function ChatBubble({
  content,
  createdAt,
  align,
  variant,
  author,
}: {
  content: string;
  createdAt: string | Date;
  align: "left" | "right";
  variant: "client" | "support";
  author?: string;
}) {
  const isRight = align === "right";
  const isClientTone = variant === "client";

  return (
    <div className={cn("flex w-full", isRight ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-[85%] sm:max-w-[70%] rounded-2xl px-4 py-3 shadow-sm",
          isRight ? "rounded-br-md" : "rounded-bl-md",
          isClientTone
            ? "bg-brand-green/20 border border-brand-green/30 text-white"
            : "bg-white/[0.06] border border-white/10 text-white/90"
        )}
      >
        {author && (
          <p
            className={cn(
              "text-xs font-medium mb-1",
              isClientTone ? "text-brand-green/90" : "text-brand-purple"
            )}
          >
            {author}
          </p>
        )}
        <p className="text-sm whitespace-pre-wrap break-words">{content}</p>
        <p className="text-[10px] text-white/40 mt-2 text-right">
          {formatDate(createdAt)}
        </p>
      </div>
    </div>
  );
}
