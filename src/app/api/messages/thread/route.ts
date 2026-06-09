import { NextResponse } from "next/server";
import { requireClient } from "@/lib/auth";
import { getClientThread } from "@/lib/messages-thread";

export async function GET() {
  const session = await requireClient();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const thread = await getClientThread(session.user.id);
  return NextResponse.json({ thread });
}
