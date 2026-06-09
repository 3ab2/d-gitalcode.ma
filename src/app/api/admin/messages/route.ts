import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export async function GET() {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const messages = await prisma.clientMessage.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { id: true, name: true, email: true } },
      replies: {
        orderBy: { createdAt: "asc" },
        include: {
          admin: { select: { id: true, name: true, email: true } },
        },
      },
      _count: { select: { replies: true } },
    },
  });

  return NextResponse.json(messages);
}
