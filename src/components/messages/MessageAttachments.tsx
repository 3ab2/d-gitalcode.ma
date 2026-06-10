"use client";

import { useState } from "react";
import {
  Archive,
  Download,
  FileSpreadsheet,
  FileText,
  ImageIcon,
  Presentation,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { cn, formatFileSize } from "@/lib/utils";
import { IMAGE_MIME_TYPES } from "@/lib/attachments/constants";

export type MessageAttachment = {
  id: string;
  originalName: string;
  mimeType: string;
  fileSize: number;
  createdAt: string;
  uploadedById?: string;
  uploadedByName?: string | null;
};

function getFileIcon(mimeType: string) {
  if (IMAGE_MIME_TYPES.has(mimeType)) return ImageIcon;
  if (mimeType.includes("spreadsheet") || mimeType.includes("excel"))
    return FileSpreadsheet;
  if (mimeType.includes("presentation") || mimeType.includes("powerpoint"))
    return Presentation;
  if (mimeType.includes("zip")) return Archive;
  return FileText;
}

function AttachmentImage({
  attachment,
  className,
}: {
  attachment: MessageAttachment;
  className?: string;
}) {
  const [loaded, setLoaded] = useState(false);
  const src = `/api/support/attachments/${attachment.id}`;

  return (
    <a
      href={src}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "group relative block overflow-hidden rounded-xl border border-white/10 bg-black/20",
        className
      )}
    >
      {!loaded && (
        <div className="absolute inset-0 animate-pulse bg-white/5" aria-hidden />
      )}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={attachment.originalName}
        loading="lazy"
        decoding="async"
        onLoad={() => setLoaded(true)}
        className={cn(
          "h-full w-full object-cover transition-opacity",
          loaded ? "opacity-100" : "opacity-0"
        )}
      />
      <span className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
        <Download className="h-5 w-5 text-white" />
      </span>
    </a>
  );
}

export function MessageAttachments({
  attachments,
  variant,
  showMeta = false,
}: {
  attachments: MessageAttachment[];
  variant: "client" | "support";
  showMeta?: boolean;
}) {
  const { t } = useTranslation();

  if (!attachments.length) return null;

  const images = attachments.filter((a) => IMAGE_MIME_TYPES.has(a.mimeType));
  const documents = attachments.filter((a) => !IMAGE_MIME_TYPES.has(a.mimeType));

  return (
    <div className="mt-2 space-y-2">
      {images.length > 0 && (
        <div
          className={cn(
            "grid gap-2",
            images.length === 1 ? "grid-cols-1" : "grid-cols-2"
          )}
        >
          {images.map((attachment) => (
            <AttachmentImage
              key={attachment.id}
              attachment={attachment}
              className={images.length === 1 ? "max-h-48 min-h-[120px]" : "aspect-square max-h-32"}
            />
          ))}
        </div>
      )}

      {documents.length > 0 && (
        <div className="space-y-1.5">
          {documents.map((attachment) => {
            const Icon = getFileIcon(attachment.mimeType);
            return (
              <a
                key={attachment.id}
                href={`/api/support/attachments/${attachment.id}`}
                download={attachment.originalName}
                className={cn(
                  "flex items-center gap-3 rounded-xl border px-3 py-2.5 transition-colors",
                  variant === "client"
                    ? "border-brand-green/20 bg-black/15 hover:bg-black/25"
                    : "border-white/10 bg-white/[0.04] hover:bg-white/[0.07]"
                )}
              >
                <span
                  className={cn(
                    "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
                    variant === "client" ? "bg-brand-green/15" : "bg-white/10"
                  )}
                >
                  <Icon className="h-4 w-4 text-brand-green" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-xs font-medium text-white/90">
                    {attachment.originalName}
                  </span>
                  <span className="text-[10px] text-white/40">
                    {formatFileSize(attachment.fileSize)}
                  </span>
                </span>
                <Download className="h-4 w-4 shrink-0 text-white/35" />
              </a>
            );
          })}
        </div>
      )}

      {showMeta && attachments[0]?.uploadedByName && (
        <p className="text-[10px] text-white/35">
          {t("support.attachments.uploadedBy")}{" "}
          <span className="text-white/50">{attachments[0].uploadedByName}</span>
        </p>
      )}
    </div>
  );
}
