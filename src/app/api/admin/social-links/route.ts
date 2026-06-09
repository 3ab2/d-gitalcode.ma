import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth";
import { getAllSocialLinksAdmin, upsertSocialLinks } from "@/lib/social-links";

const updateSchema = z.object({
  links: z.array(
    z.object({
      platform: z.enum(["instagram", "linkedin", "github", "kofi"]),
      url: z.string().url(),
      label: z.string().min(1),
      enabled: z.boolean(),
    })
  ),
});

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
    const data = updateSchema.parse(body);
    const links = await upsertSocialLinks(data.links);
    return NextResponse.json(links);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}
