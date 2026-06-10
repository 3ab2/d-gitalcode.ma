import { NextResponse } from "next/server";
import { requireClient } from "@/lib/auth";
import {
  getClientThreadWithMeta,
  serializeThread,
} from "@/lib/messages-thread";

export async function GET() {
  const session = await requireClient();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { thread, meta } = await getClientThreadWithMeta(session.user.id);
  return NextResponse.json({ thread: serializeThread(thread), meta });
}
