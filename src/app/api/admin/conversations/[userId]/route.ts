import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { getClientThread } from "@/lib/messages-thread";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { userId } = await params;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, name: true, email: true },
  });

  if (!user) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const thread = await getClientThread(userId);

  return NextResponse.json({ user, thread });
}
