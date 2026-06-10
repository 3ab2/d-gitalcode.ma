import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { listNotifications } from "@/lib/notifications/service";

export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const cursor = request.nextUrl.searchParams.get("cursor") ?? undefined;
  const limitParam = request.nextUrl.searchParams.get("limit");
  const limit = limitParam ? Math.min(parseInt(limitParam, 10), 50) : undefined;

  const result = await listNotifications(session.user.id, { cursor, limit });
  return NextResponse.json(result);
}
