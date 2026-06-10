export const MAX_ATTACHMENT_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB
export const MAX_ATTACHMENTS_PER_MESSAGE = 5;

export const ALLOWED_EXTENSIONS = new Set([
  "pdf",
  "doc",
  "docx",
  "xls",
  "xlsx",
  "ppt",
  "pptx",
  "png",
  "jpg",
  "jpeg",
  "webp",
  "zip",
]);

export const BLOCKED_EXTENSIONS = new Set([
  "exe",
  "bat",
  "cmd",
  "js",
  "sh",
  "php",
  "dll",
  "msi",
  "scr",
  "vbs",
  "ps1",
  "jar",
  "com",
  "app",
  "deb",
  "rpm",
]);

export const ALLOWED_MIME_TYPES = new Set([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "image/png",
  "image/jpeg",
  "image/webp",
  "application/zip",
  "application/x-zip-compressed",
]);

export const IMAGE_MIME_TYPES = new Set(["image/png", "image/jpeg", "image/webp"]);

export const ACCEPT_ATTRIBUTE =
  ".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.png,.jpg,.jpeg,.webp,.zip,application/pdf,application/zip,image/*";
