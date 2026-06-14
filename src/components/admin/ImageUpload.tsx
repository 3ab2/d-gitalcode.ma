"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { Upload, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { MAX_ADMIN_IMAGE_BYTES } from "@/lib/admin/upload-validation";

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  folder?: string;
  label?: string;
}

const MAX_MB = MAX_ADMIN_IMAGE_BYTES / (1024 * 1024);

/** Admin preview: load Cloudinary directly (skip /_next/image proxy timeouts in dev). */
function previewImageSrc(url: string): string {
  if (!url.includes("res.cloudinary.com/image/upload/")) return url;
  const [prefix, rest] = url.split("/image/upload/");
  if (!rest || rest.includes("f_auto,")) return url;
  return `${prefix}/image/upload/f_auto,q_auto,w_480,c_limit/${rest}`;
}

function formatUploadError(
  status: number,
  data: { error?: string; message?: string }
) {
  if (data.message) return data.message;
  if (status === 413) {
    return `Image is too large. Maximum size is ${MAX_MB} MB.`;
  }
  if (status === 503 && data.error === "invalid_credentials") {
    return "Cloudinary credentials are invalid. Update CLOUDINARY_* in your environment.";
  }
  if (status === 503 && data.error === "not_configured") {
    return "Image upload is not configured on this server.";
  }
  if (status === 504 && data.error === "timeout") {
    return "Upload timed out. Try a smaller image.";
  }
  if (data.error === "file_too_large") {
    return `Image exceeds ${MAX_MB} MB limit`;
  }
  return data.error ?? "Upload failed";
}

export function ImageUpload({
  value,
  onChange,
  folder = "dgitalcode",
  label = "Image",
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (file: File) => {
    setError("");

    if (file.size > MAX_ADMIN_IMAGE_BYTES) {
      setError(`Image exceeds ${MAX_MB} MB limit. Choose a smaller file or compress it.`);
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", folder);

    try {
      const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
      const data = (await res.json()) as {
        success?: boolean;
        error?: string;
        message?: string;
        url?: string;
      };
      if (!res.ok || data.success === false) {
        throw new Error(formatUploadError(res.status, data));
      }
      if (!data.url) throw new Error("Upload failed");
      onChange(data.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-white/80">{label}</label>
      {value ? (
        <div className="relative w-full h-40 rounded-xl overflow-hidden border border-white/10">
          <Image
            src={previewImageSrc(value)}
            alt="Upload preview"
            fill
            unoptimized
            sizes="320px"
            className="object-cover"
          />
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/60 text-white hover:bg-red-500/80"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <div
          onClick={() => inputRef.current?.click()}
          className="flex flex-col items-center justify-center h-32 rounded-xl border border-dashed border-white/20 bg-white/[0.02] cursor-pointer hover:border-brand-green/40 transition-colors"
        >
          <Upload className="h-6 w-6 text-white/40 mb-2" />
          <span className="text-sm text-white/40">
            {uploading ? "Uploading..." : `Click to upload image (max ${MAX_MB} MB)`}
          </span>
        </div>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) void handleUpload(file);
        }}
      />
      {value && (
        <Button type="button" variant="outline" size="sm" onClick={() => inputRef.current?.click()}>
          Change image
        </Button>
      )}
      {error && <p className="text-sm text-red-400">{error}</p>}
    </div>
  );
}
