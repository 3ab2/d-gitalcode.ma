import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { getAdminConversations } from "@/lib/messages-thread";

export async function GET() {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const conversations = await getAdminConversations();
  return NextResponse.json(conversations);
}
