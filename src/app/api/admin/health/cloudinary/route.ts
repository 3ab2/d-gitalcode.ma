import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { getCloudinaryConfigStatus } from "@/config/cloudinary";
import { isCloudinaryConfigured, uploadImage } from "@/lib/cloudinary";

const DEMO_IMAGE_URL =
  "https://res.cloudinary.com/demo/image/upload/sample.jpg";

/** Admin-only: verify Cloudinary env + live upload on the current deployment. */
export async function GET() {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const status = getCloudinaryConfigStatus();
  if (!status.ok) {
    return NextResponse.json({
      ok: false,
      stage: "config",
      missing: status.missing,
      message: status.message,
    });
  }

  const { cloudName } = status.config;
  const uploaded = await uploadImage(DEMO_IMAGE_URL, "dgitalcode/health-check");

  return NextResponse.json({
    ok: Boolean(uploaded),
    stage: uploaded ? "upload" : "cloudinary_api",
    configured: isCloudinaryConfigured(),
    cloudNameLength: cloudName.length,
    cloudNameHint: `${cloudName.slice(0, 2)}***${cloudName.slice(-2)}`,
    uploadPublicId: uploaded?.publicId ?? null,
    vercelEnv: process.env.VERCEL_ENV ?? null,
  });
}

export const maxDuration = 30;
