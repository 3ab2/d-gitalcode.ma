import { v2 as cloudinary } from "cloudinary";
import {
  getCloudinaryConfig,
  getCloudinaryConfigStatus,
  isCloudinaryEnvConfigured,
} from "@/config/cloudinary";
import { logError } from "@/lib/logger";

const CLOUDINARY_SDK_VERSION = "2.10.0";

let configured = false;

function ensureCloudinaryConfigured(): boolean {
  if (!isCloudinaryEnvConfigured()) return false;

  if (!configured) {
    const { cloudName, apiKey, apiSecret } = getCloudinaryConfig();
    cloudinary.config({
      cloud_name: cloudName,
      api_key: apiKey,
      api_secret: apiSecret,
      secure: true,
      sdk_semver: CLOUDINARY_SDK_VERSION,
    });
    configured = true;
  }

  return true;
}

function buildManualOptimizedUrl(
  publicId: string,
  options?: { width?: number; height?: number; crop?: string }
): string {
  const { cloudName } = getCloudinaryConfig();
  if (!cloudName || !publicId) return "";

  const transforms = ["f_auto", "q_auto"];
  if (options?.width) transforms.push(`w_${options.width}`);
  if (options?.height) transforms.push(`h_${options.height}`);
  if (options?.crop) transforms.push(`c_${options.crop}`);

  const transformSegment = transforms.join(",");
  const normalizedId = publicId.replace(/^\/+/, "");
  return `https://res.cloudinary.com/${cloudName}/image/upload/${transformSegment}/${normalizedId}`;
}

export const CLOUDINARY_UPLOAD_TIMEOUT_MS = 30_000;

export function isCloudinaryConfigured(): boolean {
  return isCloudinaryEnvConfigured();
}

export type ImageUploadResult = {
  secureUrl: string;
  publicId: string;
  optimizedUrl: string;
};

export type ImageResourceDetails = {
  width: number;
  height: number;
  format: string;
  bytes: number;
};

function attachmentResourceType(mimeType: string): "image" | "raw" {
  return mimeType.startsWith("image/") ? "image" : "raw";
}

function withUploadTimeout<T>(
  operation: (setAbortHandler: (handler: () => void) => void) => Promise<T>
): Promise<T> {
  let abortHandler: (() => void) | undefined;
  let timedOut = false;

  const timeoutPromise = new Promise<never>((_, reject) => {
    setTimeout(() => {
      timedOut = true;
      abortHandler?.();
      reject(new Error("[cloudinary] upload_timeout"));
    }, CLOUDINARY_UPLOAD_TIMEOUT_MS);
  });

  const operationPromise = operation((handler) => {
    abortHandler = handler;
  }).then((result) => {
    if (timedOut) {
      throw new Error("[cloudinary] upload_timeout");
    }
    return result;
  });

  return Promise.race([operationPromise, timeoutPromise]);
}

/**
 * Build a delivery URL with f_auto (best format) and q_auto (best quality/size).
 */
export function buildOptimizedImageUrl(
  publicId: string,
  options?: { width?: number; height?: number; crop?: string }
): string {
  if (!ensureCloudinaryConfigured()) {
    return buildManualOptimizedUrl(publicId, options);
  }

  try {
    return cloudinary.url(publicId, {
      secure: true,
      fetch_format: "auto",
      quality: "auto",
      width: options?.width,
      height: options?.height,
      crop: options?.crop,
      // Next.js bundling breaks SDK analytics (sdk_semver); disable to avoid 500s.
      analytics: false,
      urlAnalytics: false,
      sdk_semver: CLOUDINARY_SDK_VERSION,
    });
  } catch (error) {
    logError("cloudinary", error, { event: "optimized_url_fallback", publicId });
    return buildManualOptimizedUrl(publicId, options);
  }
}

export async function getImageResourceDetails(
  publicId: string
): Promise<ImageResourceDetails | null> {
  if (!ensureCloudinaryConfigured()) return null;

  try {
    const resource = await cloudinary.api.resource(publicId, {
      resource_type: "image",
    });
    return {
      width: resource.width,
      height: resource.height,
      format: resource.format,
      bytes: resource.bytes,
    };
  } catch (error) {
    logError("cloudinary", error, { event: "resource_fetch_failed", publicId });
    return null;
  }
}

export async function uploadImage(
  file: string,
  folder = "dgitalcode"
): Promise<ImageUploadResult | null> {
  if (!ensureCloudinaryConfigured()) return null;

  try {
    const result = await withUploadTimeout(() =>
      cloudinary.uploader.upload(file, {
        folder,
        resource_type: "image",
        timeout: CLOUDINARY_UPLOAD_TIMEOUT_MS,
      })
    );

    return {
      secureUrl: result.secure_url,
      publicId: result.public_id,
      optimizedUrl: buildOptimizedImageUrl(result.public_id),
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "unknown";
    if (message.includes("upload_timeout")) {
      logError("cloudinary", error, { event: "image_upload_timeout" });
    } else {
      logError("cloudinary", error, { event: "image_upload_failed" });
    }
    return null;
  }
}

export type CloudinaryUploadResult = {
  secureUrl: string;
  publicId: string;
  resourceType: "image" | "raw";
};

export type CloudinaryUploadFailureReason =
  | "not_configured"
  | "timeout"
  | "invalid_credentials"
  | "upload_failed";

export type CloudinaryBufferUploadResult =
  | {
      ok: true;
      secureUrl: string;
      publicId: string;
      resourceType: "image" | "raw";
    }
  | {
      ok: false;
      reason: CloudinaryUploadFailureReason;
      message?: string;
    };

function classifyCloudinaryError(error: unknown): {
  reason: CloudinaryUploadFailureReason;
  message?: string;
} {
  const text =
    error instanceof Error
      ? error.message
      : typeof error === "object" && error !== null
        ? JSON.stringify(error)
        : String(error);

  if (text.includes("upload_timeout")) {
    return { reason: "timeout" };
  }

  if (
    text.includes("Invalid cloud_name") ||
    text.includes("Invalid API Key") ||
    text.includes("http_code\":401") ||
    text.includes("http_code\":403") ||
    text.includes("http_code: 401") ||
    text.includes("http_code: 403")
  ) {
    return {
      reason: "invalid_credentials",
      message: "Cloudinary rejected the credentials. Check CLOUDINARY_* in .env.",
    };
  }

  return { reason: "upload_failed", message: text.slice(0, 200) };
}

export async function uploadAttachmentBuffer(
  buffer: Buffer,
  options: {
    folder: string;
    mimeType: string;
    originalName?: string;
  }
): Promise<CloudinaryBufferUploadResult> {
  if (!ensureCloudinaryConfigured()) {
    return { ok: false, reason: "not_configured" };
  }

  const resourceType = attachmentResourceType(options.mimeType);

  try {
    const result = await withUploadTimeout((setAbortHandler) => {
      return new Promise<CloudinaryBufferUploadResult>((resolve, reject) => {
        const upload = cloudinary.uploader.upload_stream(
          {
            folder: options.folder,
            resource_type: resourceType,
            use_filename: Boolean(options.originalName),
            unique_filename: true,
            filename_override: options.originalName
              ? options.originalName.replace(/[^\w.\-]+/g, "_").slice(0, 120)
              : undefined,
            timeout: CLOUDINARY_UPLOAD_TIMEOUT_MS,
          },
          (error, uploadResult) => {
            if (error || !uploadResult) {
              reject(error ?? new Error("[cloudinary] upload_failed"));
              return;
            }
            resolve({
              ok: true,
              secureUrl: uploadResult.secure_url,
              publicId: uploadResult.public_id,
              resourceType,
            });
          }
        );

        setAbortHandler(() => {
          upload.destroy?.();
        });

        upload.on("error", (streamError) => {
          reject(streamError);
        });

        upload.end(buffer);
      });
    });

    return result;
  } catch (error) {
    const classified = classifyCloudinaryError(error);
    if (classified.reason === "timeout") {
      logError("cloudinary", error, { event: "attachment_upload_timeout" });
    } else {
      logError("cloudinary", error, { event: "attachment_upload_failed" });
    }
    return { ok: false, ...classified };
  }
}

export async function deleteCloudinaryResource(
  publicId: string,
  resourceType: "image" | "raw" | "auto" = "auto"
): Promise<boolean> {
  if (!ensureCloudinaryConfigured()) return false;

  const types: Array<"image" | "raw"> =
    resourceType === "auto" ? ["image", "raw"] : [resourceType];

  for (const type of types) {
    try {
      const result = await cloudinary.uploader.destroy(publicId, {
        resource_type: type,
      });
      if (result.result === "ok" || result.result === "not found") {
        return true;
      }
    } catch {
      // try next resource type
    }
  }

  return false;
}

export async function deleteImage(publicId: string): Promise<boolean> {
  return deleteCloudinaryResource(publicId, "image");
}

export { cloudinary };
