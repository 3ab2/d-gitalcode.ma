import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { markAllNotificationsRead } from "@/lib/notifications/service";

export async function POST() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const updated = await markAllNotificationsRead(session.user.id);
  return NextResponse.json({ updated });
}
