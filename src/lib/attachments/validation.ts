import {
  ALLOWED_EXTENSIONS,
  ALLOWED_MIME_TYPES,
  BLOCKED_EXTENSIONS,
  MAX_ATTACHMENT_SIZE_BYTES,
  MAX_ATTACHMENTS_PER_MESSAGE,
} from "./constants";

export type ValidationErrorCode =
  | "too_many_files"
  | "file_too_large"
  | "blocked_extension"
  | "invalid_extension"
  | "invalid_mime"
  | "mime_extension_mismatch"
  | "empty_file"
  | "invalid_filename";

export class AttachmentValidationError extends Error {
  constructor(
    public readonly code: ValidationErrorCode,
    message: string
  ) {
    super(message);
    this.name = "AttachmentValidationError";
  }
}

const EXTENSION_MIME_MAP: Record<string, string[]> = {
  pdf: ["application/pdf"],
  doc: ["application/msword"],
  docx: [
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ],
  xls: ["application/vnd.ms-excel"],
  xlsx: [
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ],
  ppt: ["application/vnd.ms-powerpoint"],
  pptx: [
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  ],
  png: ["image/png"],
  jpg: ["image/jpeg"],
  jpeg: ["image/jpeg"],
  webp: ["image/webp"],
  zip: ["application/zip", "application/x-zip-compressed"],
};

function sanitizeBasename(name: string): string {
  const base = name.split(/[/\\]/).pop() ?? name;
  return base.replace(/\0/g, "").trim();
}

function getExtension(filename: string): string | null {
  const base = sanitizeBasename(filename);
  const parts = base.split(".");
  if (parts.length < 2) return null;

  const ext = parts.pop()?.toLowerCase();
  if (!ext) return null;

  const secondLast = parts.at(-1)?.toLowerCase();
  if (secondLast && BLOCKED_EXTENSIONS.has(secondLast)) {
    throw new AttachmentValidationError(
      "blocked_extension",
      `Blocked double extension in filename: ${base}`
    );
  }

  return ext;
}

export function validateAttachmentCount(count: number): void {
  if (count > MAX_ATTACHMENTS_PER_MESSAGE) {
    throw new AttachmentValidationError(
      "too_many_files",
      `Maximum ${MAX_ATTACHMENTS_PER_MESSAGE} attachments per message`
    );
  }
}

export function validateAttachmentFile(
  file: Pick<File, "name" | "type" | "size">
): { extension: string; mimeType: string } {
  if (file.size <= 0) {
    throw new AttachmentValidationError("empty_file", "File is empty");
  }

  if (file.size > MAX_ATTACHMENT_SIZE_BYTES) {
    throw new AttachmentValidationError(
      "file_too_large",
      `File exceeds ${MAX_ATTACHMENT_SIZE_BYTES / (1024 * 1024)} MB limit`
    );
  }

  const basename = sanitizeBasename(file.name);
  if (!basename || basename === "." || basename === "..") {
    throw new AttachmentValidationError(
      "invalid_filename",
      "Invalid filename"
    );
  }

  const extension = getExtension(basename);
  if (!extension) {
    throw new AttachmentValidationError(
      "invalid_extension",
      "File must have a valid extension"
    );
  }

  if (BLOCKED_EXTENSIONS.has(extension)) {
    throw new AttachmentValidationError(
      "blocked_extension",
      `Extension .${extension} is not allowed`
    );
  }

  if (!ALLOWED_EXTENSIONS.has(extension)) {
    throw new AttachmentValidationError(
      "invalid_extension",
      `Extension .${extension} is not allowed`
    );
  }

  const mimeType = (file.type || "").toLowerCase().split(";")[0].trim();
  if (!mimeType || !ALLOWED_MIME_TYPES.has(mimeType)) {
    throw new AttachmentValidationError(
      "invalid_mime",
      `MIME type ${mimeType || "unknown"} is not allowed`
    );
  }

  const allowedMimes = EXTENSION_MIME_MAP[extension];
  if (!allowedMimes?.includes(mimeType)) {
    throw new AttachmentValidationError(
      "mime_extension_mismatch",
      `Extension .${extension} does not match MIME type ${mimeType}`
    );
  }

  return { extension, mimeType };
}

export function validateAttachmentFiles(
  files: Pick<File, "name" | "type" | "size">[]
): Array<{ extension: string; mimeType: string }> {
  validateAttachmentCount(files.length);
  return files.map((file) => validateAttachmentFile(file));
}
