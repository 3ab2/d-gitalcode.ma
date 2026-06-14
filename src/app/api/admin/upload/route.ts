import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import {
  buildOptimizedImageUrl,
  uploadAttachmentBuffer,
} from "@/lib/cloudinary";
import { getCloudinaryConfigStatus } from "@/config/cloudinary";
import { logAdminAction } from "@/lib/audit";
import { logError } from "@/lib/logger";
import {
  UploadValidationError,
  validateAdminImageFile,
} from "@/lib/admin/upload-validation";

type UploadSuccessResponse = {
  success: true;
  url: string;
  publicId: string;
  optimizedUrl: string;
};

type UploadErrorResponse = {
  success: false;
  error: string;
};

function uploadError(message: string, status: number) {
  return NextResponse.json(
    { success: false, error: message } satisfies UploadErrorResponse,
    { status }
  );
}

function uploadSuccess(body: Omit<UploadSuccessResponse, "success">) {
  return NextResponse.json({
    success: true,
    ...body,
  } satisfies UploadSuccessResponse);
}

function isFileLike(value: FormDataEntryValue | null): value is File {
  return (
    value !== null &&
    typeof value === "object" &&
    "arrayBuffer" in value &&
    typeof value.arrayBuffer === "function"
  );
}

function logUploadFailure(error: unknown, context?: Record<string, unknown>) {
  logError("admin/upload", error, context);
  if (process.env.NODE_ENV !== "production" && error instanceof Error && error.stack) {
    console.error("[admin/upload] stack:", error.stack);
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await requireAdmin();
    if (!session) {
      return uploadError("Unauthorized", 401);
    }

    const cloudinaryStatus = getCloudinaryConfigStatus();
    if (!cloudinaryStatus.ok) {
      const message =
        process.env.VERCEL === "1"
          ? `${cloudinaryStatus.message} Add them in Vercel → Project Settings → Environment Variables (Production).`
          : cloudinaryStatus.message;
      return uploadError(message, 503);
    }

    let formData: FormData;
    try {
      formData = await request.formData();
    } catch (error) {
      logUploadFailure(error, { stage: "form_data_parse" });
      return uploadError("Invalid upload request body", 400);
    }

    const fileEntry = formData.get("file");
    if (!isFileLike(fileEntry)) {
      return uploadError("No file provided. Send a multipart field named \"file\".", 400);
    }

    const folderRaw = formData.get("folder");
    const folder =
      typeof folderRaw === "string" && folderRaw.trim()
        ? folderRaw.trim().replace(/[^\w./-]/g, "_").slice(0, 80)
        : "dgitalcode";

    let mimeType: string;
    try {
      ({ mimeType } = validateAdminImageFile(fileEntry));
    } catch (error) {
      if (error instanceof UploadValidationError) {
        return uploadError(error.message, 400);
      }
      logUploadFailure(error, { stage: "file_validation" });
      return uploadError("Invalid image file", 400);
    }

    let buffer: Buffer;
    try {
      const bytes = await fileEntry.arrayBuffer();
      buffer = Buffer.from(bytes);
    } catch (error) {
      logUploadFailure(error, { stage: "file_buffer_read" });
      return uploadError("Failed to read uploaded file", 400);
    }

    const result = await uploadAttachmentBuffer(buffer, {
      folder,
      mimeType,
      originalName: fileEntry.name,
    });

    if (!result.ok) {
      const messageByReason = {
        not_configured:
          "Image upload is not configured. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in .env or .env.local.",
        invalid_credentials:
          result.message ??
          "Cloudinary rejected the upload credentials. Verify CLOUDINARY_* values.",
        timeout: "Upload timed out. Try a smaller image or check your network connection.",
        upload_failed: result.message ?? "Cloudinary upload failed. Please try again.",
      } as const;

      const statusByReason = {
        not_configured: 503,
        invalid_credentials: 503,
        timeout: 504,
        upload_failed: 500,
      } as const;

      return uploadError(
        messageByReason[result.reason],
        statusByReason[result.reason]
      );
    }

    let optimizedUrl = result.secureUrl;
    try {
      optimizedUrl = buildOptimizedImageUrl(result.publicId) || result.secureUrl;
    } catch (error) {
      logUploadFailure(error, {
        stage: "optimized_url",
        publicId: result.publicId,
      });
      optimizedUrl = result.secureUrl;
    }

    // Audit logging must never fail the upload after Cloudinary succeeded.
    void logAdminAction({
      userId: session.user.id,
      userEmail: session.user.email,
      action: "CREATE",
      entity: "media",
      metadata: {
        url: result.secureUrl,
        publicId: result.publicId,
        folder,
      },
    });

    return uploadSuccess({
      url: result.secureUrl,
      publicId: result.publicId,
      optimizedUrl,
    });
  } catch (error) {
    logUploadFailure(error, { stage: "unhandled" });
    const message =
      error instanceof Error ? error.message : "Unexpected upload error";
    return uploadError(message, 500);
  }
}

export const maxDuration = 60;
