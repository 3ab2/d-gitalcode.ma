import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { canAccessAttachment } from "@/lib/attachments/access";
import { getAttachmentBuffer } from "@/lib/attachments/service";
import { IMAGE_MIME_TYPES } from "@/lib/attachments/constants";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const allowed = await canAccessAttachment(
    id,
    session.user.id,
    session.user.role ?? "USER"
  );

  if (!allowed) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const file = await getAttachmentBuffer(id);
  if (!file) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const isThumb = request.nextUrl.searchParams.get("thumb") === "1";
  const isImage = IMAGE_MIME_TYPES.has(file.mimeType);

  const headers = new Headers({
    "Content-Type": file.mimeType,
    "Content-Length": String(file.buffer.length),
    "Cache-Control": "private, max-age=3600",
    "X-Content-Type-Options": "nosniff",
  });

  if (!isImage || isThumb) {
    headers.set(
      "Content-Disposition",
      `attachment; filename="${encodeURIComponent(file.originalName)}"`
    );
  } else {
    headers.set(
      "Content-Disposition",
      `inline; filename="${encodeURIComponent(file.originalName)}"`
    );
  }

  return new NextResponse(new Uint8Array(file.buffer), {
    status: 200,
    headers,
  });
}
