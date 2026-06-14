import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { uploadImage } from "@/lib/cloudinary";
import { logAdminAction } from "@/lib/audit";
import { logError } from "@/lib/logger";
import {
  UploadValidationError,
  validateAdminImageFile,
} from "@/lib/admin/upload-validation";

export async function POST(request: NextRequest) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const folder = (formData.get("folder") as string) || "dgitalcode";

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const { mimeType } = validateAdminImageFile(file);

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = `data:${mimeType};base64,${buffer.toString("base64")}`;
    const result = await uploadImage(base64, folder);

    if (!result) {
      return NextResponse.json(
        { error: "Upload failed. Check Cloudinary configuration." },
        { status: 500 }
      );
    }

    await logAdminAction({
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

    return NextResponse.json({
      url: result.secureUrl,
      publicId: result.publicId,
      optimizedUrl: result.optimizedUrl,
    });
  } catch (error) {
    if (error instanceof UploadValidationError) {
      return NextResponse.json(
        { error: error.code, message: error.message },
        { status: 400 }
      );
    }
    logError("admin/upload", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
