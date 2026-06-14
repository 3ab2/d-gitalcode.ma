export type UploadValidationErrorCode =
  | "file_too_large"
  | "invalid_extension"
  | "invalid_mime"
  | "mime_extension_mismatch"
  | "empty_file"
  | "invalid_filename";

export class UploadValidationError extends Error {
  constructor(
    public readonly code: UploadValidationErrorCode,
    message: string
  ) {
    super(message);
    this.name = "UploadValidationError";
  }
}

const EXTENSION_MIME_MAP: Record<string, string[]> = {
  png: ["image/png"],
  jpg: ["image/jpeg"],
  jpeg: ["image/jpeg"],
  webp: ["image/webp"],
};

const ADMIN_IMAGE_EXTENSIONS = new Set(["png", "jpg", "jpeg", "webp"]);
const ADMIN_IMAGE_MIMES = new Set(["image/png", "image/jpeg", "image/webp"]);
const MAX_ADMIN_IMAGE_BYTES = 10 * 1024 * 1024;

function sanitizeBasename(name: string): string {
  const base = name.split(/[/\\]/).pop() ?? name;
  return base.replace(/\0/g, "").trim();
}

function getExtension(filename: string): string | null {
  const base = sanitizeBasename(filename);
  const parts = base.split(".");
  if (parts.length < 2) return null;
  return parts.pop()?.toLowerCase() ?? null;
}

/** Backend validation for CMS image uploads (admin). */
export function validateAdminImageFile(
  file: Pick<File, "name" | "type" | "size">
): { extension: string; mimeType: string } {
  if (file.size <= 0) {
    throw new UploadValidationError("empty_file", "File is empty");
  }

  if (file.size > MAX_ADMIN_IMAGE_BYTES) {
    throw new UploadValidationError(
      "file_too_large",
      `Image exceeds ${MAX_ADMIN_IMAGE_BYTES / (1024 * 1024)} MB limit`
    );
  }

  const basename = sanitizeBasename(file.name);
  if (!basename || basename === "." || basename === "..") {
    throw new UploadValidationError("invalid_filename", "Invalid filename");
  }

  const extension = getExtension(basename);
  if (!extension || !ADMIN_IMAGE_EXTENSIONS.has(extension)) {
    throw new UploadValidationError(
      "invalid_extension",
      "Only PNG, JPG, JPEG and WebP images are allowed"
    );
  }

  const mimeType = (file.type || "").toLowerCase().split(";")[0].trim();
  if (!mimeType || !ADMIN_IMAGE_MIMES.has(mimeType)) {
    throw new UploadValidationError(
      "invalid_mime",
      `MIME type ${mimeType || "unknown"} is not allowed`
    );
  }

  const allowedMimes = EXTENSION_MIME_MAP[extension];
  if (!allowedMimes?.includes(mimeType)) {
    throw new UploadValidationError(
      "mime_extension_mismatch",
      `Extension .${extension} does not match MIME type ${mimeType}`
    );
  }

  return { extension, mimeType };
}
