import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth";
import { logAdminAction } from "@/lib/audit";
import { getAllSocialLinksAdmin, upsertSocialLinks } from "@/lib/social-links";
import { socialLinksUpdateSchema } from "@/lib/admin/schemas";

export async function GET() {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const links = await getAllSocialLinksAdmin();
  return NextResponse.json(links);
}

export async function PUT(request: NextRequest) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const data = socialLinksUpdateSchema.parse(body);
    const links = await upsertSocialLinks(data.links);

    await logAdminAction({
      userId: session.user.id,
      userEmail: session.user.email,
      action: "UPDATE",
      entity: "social_links",
    });

    return NextResponse.json(links);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}
