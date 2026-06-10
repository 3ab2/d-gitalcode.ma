"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Camera, Paperclip, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { cn, formatFileSize } from "@/lib/utils";
import {
  ACCEPT_ATTRIBUTE,
  IMAGE_MIME_TYPES,
  MAX_ATTACHMENTS_PER_MESSAGE,
  MAX_ATTACHMENT_SIZE_BYTES,
} from "@/lib/attachments/constants";

export type PendingAttachment = {
  id: string;
  file: File;
  previewUrl: string | null;
};

type AttachmentComposerProps = {
  files: PendingAttachment[];
  onChange: (files: PendingAttachment[]) => void;
  disabled?: boolean;
  onAddFiles?: (files: FileList | File[]) => void;
};

function createPending(file: File): PendingAttachment {
  const previewUrl = IMAGE_MIME_TYPES.has(file.type)
    ? URL.createObjectURL(file)
    : null;
  return {
    id: `${file.name}-${file.size}-${file.lastModified}-${crypto.randomUUID()}`,
    file,
    previewUrl,
  };
}

export function AttachmentComposer({
  files,
  onChange,
  disabled = false,
  fileInputRef: externalFileRef,
  cameraInputRef: externalCameraRef,
  hideButtons = false,
}: AttachmentComposerProps & {
  fileInputRef?: React.RefObject<HTMLInputElement | null>;
  cameraInputRef?: React.RefObject<HTMLInputElement | null>;
  hideButtons?: boolean;
}) {
  const { t } = useTranslation();
  const internalFileRef = useRef<HTMLInputElement>(null);
  const internalCameraRef = useRef<HTMLInputElement>(null);
  const fileInputRef = externalFileRef ?? internalFileRef;
  const cameraInputRef = externalCameraRef ?? internalCameraRef;
  const [error, setError] = useState<string | null>(null);

  const revokePreviews = useCallback((items: PendingAttachment[]) => {
    items.forEach((item) => {
      if (item.previewUrl) URL.revokeObjectURL(item.previewUrl);
    });
  }, []);

  useEffect(() => {
    return () => revokePreviews(files);
  }, [files, revokePreviews]);

  const addFiles = (incoming: FileList | File[]) => {
    setError(null);
    const list = Array.from(incoming);
    if (files.length + list.length > MAX_ATTACHMENTS_PER_MESSAGE) {
      setError(t("support.attachments.tooMany", { max: MAX_ATTACHMENTS_PER_MESSAGE }));
      return;
    }

    for (const file of list) {
      if (file.size > MAX_ATTACHMENT_SIZE_BYTES) {
        setError(t("support.attachments.tooLarge", { max: 10 }));
        return;
      }
    }

    onChange([...files, ...list.map(createPending)]);
  };

  const removeFile = (id: string) => {
    const target = files.find((f) => f.id === id);
    if (target?.previewUrl) URL.revokeObjectURL(target.previewUrl);
    onChange(files.filter((f) => f.id !== id));
    setError(null);
  };

  return (
    <div className="space-y-2">
      {files.length > 0 && (
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
          {files.map((item) => (
            <div
              key={item.id}
              className="relative shrink-0 w-20 rounded-xl border border-white/10 bg-white/[0.04] overflow-hidden"
            >
              {item.previewUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={item.previewUrl}
                  alt=""
                  className="h-16 w-20 object-cover"
                />
              ) : (
                <div className="flex h-16 w-20 flex-col items-center justify-center px-1 text-center">
                  <Paperclip className="h-4 w-4 text-white/40" />
                  <span className="mt-1 line-clamp-2 text-[8px] text-white/50">
                    {item.file.name}
                  </span>
                </div>
              )}
              <div className="px-1.5 py-1 border-t border-white/5">
                <p className="truncate text-[9px] text-white/45">
                  {formatFileSize(item.file.size)}
                </p>
              </div>
              <button
                type="button"
                onClick={() => removeFile(item.id)}
                disabled={disabled}
                className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/70 text-white/80 hover:bg-black/90"
                aria-label={t("support.attachments.remove")}
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {error && (
        <p className="text-[11px] text-red-400/90" role="alert">
          {error}
        </p>
      )}

      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept={ACCEPT_ATTRIBUTE}
        className="hidden"
        disabled={disabled}
        onChange={(e) => {
          if (e.target.files?.length) addFiles(e.target.files);
          e.target.value = "";
        }}
      />
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        disabled={disabled}
        onChange={(e) => {
          if (e.target.files?.length) addFiles(e.target.files);
          e.target.value = "";
        }}
      />

      {!hideButtons && (
        <AttachmentPickerButtons
          disabled={disabled}
          fileCount={files.length}
          onPickFiles={() => fileInputRef.current?.click()}
          onPickCamera={() => cameraInputRef.current?.click()}
        />
      )}
    </div>
  );
}

export function AttachmentPickerButtons({
  disabled = false,
  fileCount = 0,
  onPickFiles,
  onPickCamera,
}: {
  disabled?: boolean;
  fileCount?: number;
  onPickFiles: () => void;
  onPickCamera: () => void;
}) {
  const { t } = useTranslation();
  const atLimit = fileCount >= MAX_ATTACHMENTS_PER_MESSAGE;

  return (
    <div className="flex shrink-0 items-center gap-0.5">
      <button
        type="button"
        disabled={disabled || atLimit}
        onClick={onPickFiles}
        className={cn(
          "flex h-10 w-10 items-center justify-center rounded-xl text-white/50 transition-colors hover:bg-white/5 hover:text-white/80",
          (disabled || atLimit) && "opacity-40"
        )}
        aria-label={t("support.attachments.add")}
      >
        <Paperclip className="h-4 w-4" />
      </button>
      <button
        type="button"
        disabled={disabled || atLimit}
        onClick={onPickCamera}
        className={cn(
          "flex h-10 w-10 items-center justify-center rounded-xl text-white/50 transition-colors hover:bg-white/5 hover:text-white/80 md:hidden",
          (disabled || atLimit) && "opacity-40"
        )}
        aria-label={t("support.attachments.camera")}
      >
        <Camera className="h-4 w-4" />
      </button>
    </div>
  );
}

export function useAttachmentDropZone(
  onFiles: (files: FileList | File[]) => void,
  disabled = false
) {
  const [dragOver, setDragOver] = useState(false);

  return {
    dragOver,
    handlers: {
      onDragEnter: (e: React.DragEvent) => {
        e.preventDefault();
        if (!disabled) setDragOver(true);
      },
      onDragOver: (e: React.DragEvent) => e.preventDefault(),
      onDragLeave: (e: React.DragEvent) => {
        e.preventDefault();
        setDragOver(false);
      },
      onDrop: (e: React.DragEvent) => {
        e.preventDefault();
        setDragOver(false);
        if (!disabled && e.dataTransfer.files.length) {
          onFiles(e.dataTransfer.files);
        }
      },
    },
  };
}

export function uploadMessageWithAttachments(
  content: string,
  files: File[],
  onProgress?: (percent: number) => void
): Promise<Response> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    const formData = new FormData();
    formData.append("content", content);
    files.forEach((file) => formData.append("files", file));

    xhr.open("POST", "/api/messages");
    xhr.withCredentials = true;

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable && onProgress) {
        onProgress(Math.round((event.loaded / event.total) * 100));
      }
    };

    xhr.onload = () => {
      resolve(
        new Response(xhr.responseText, {
          status: xhr.status,
          headers: { "Content-Type": "application/json" },
        })
      );
    };

    xhr.onerror = () => reject(new Error("Upload failed"));
    xhr.send(formData);
  });
}
