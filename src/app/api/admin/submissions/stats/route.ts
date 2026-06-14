import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { getLeadStats } from "@/lib/leads/service";

export async function GET() {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const stats = await getLeadStats();
  return NextResponse.json(stats);
}
