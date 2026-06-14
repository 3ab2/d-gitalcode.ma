import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth";
import { SUPPORTED_CURRENCIES } from "@/lib/currency";
import { getSiteSettings, upsertSiteSettings } from "@/lib/settings";
import { logAdminAction } from "@/lib/audit";
import { logError } from "@/lib/logger";

const settingsSchema = z.object({
  contactEmail: z.string().email().optional(),
  whatsappNumber: z.string().min(8).max(20).optional(),
  phone: z.string().min(3).max(40).optional(),
  address: z.string().min(3).max(300).optional(),
  seoTitle: z.string().min(3).max(120).optional(),
  seoDescription: z.string().min(10).max(320).optional(),
  seoKeywords: z.string().min(3).max(500).optional(),
  productDemoUrl: z.string().url().optional().or(z.literal("")),
  defaultCurrency: z.enum(SUPPORTED_CURRENCIES).optional(),
});

export async function GET() {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const settings = await getSiteSettings();
  return NextResponse.json(settings);
}

export async function PUT(request: NextRequest) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const data = settingsSchema.parse(body);
    const settings = await upsertSiteSettings(data);

    await logAdminAction({
      userId: session.user.id,
      userEmail: session.user.email,
      action: "UPDATE",
      entity: "site_settings",
    });

    return NextResponse.json(settings);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    logError("admin/settings", error);
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 });
  }
}
