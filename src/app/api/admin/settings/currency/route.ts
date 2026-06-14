import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth";
import { SUPPORTED_CURRENCIES } from "@/lib/currency";
import {
  getPublicCurrencySettings,
  updateDefaultCurrency,
} from "@/lib/currency/settings";
import { logAdminAction } from "@/lib/audit";
import { logError } from "@/lib/logger";

const currencySchema = z.object({
  currency: z.enum(SUPPORTED_CURRENCIES),
});

export async function GET() {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const data = await getPublicCurrencySettings();
  return NextResponse.json(data);
}

export async function POST(request: NextRequest) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { currency } = currencySchema.parse(body);
    const data = await updateDefaultCurrency(currency);

    await logAdminAction({
      userId: session.user.id,
      userEmail: session.user.email,
      action: "UPDATE",
      entity: "site_currency",
      metadata: { currency },
    });

    return NextResponse.json(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    logError("admin/settings/currency", error);
    return NextResponse.json({ error: "Failed to update currency" }, { status: 500 });
  }
}
