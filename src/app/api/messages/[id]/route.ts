import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireClient } from "@/lib/auth";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireClient();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const message = await prisma.clientMessage.findFirst({
    where: { id, userId: session.user.id },
    include: {
      replies: {
        orderBy: { createdAt: "asc" },
        include: {
          admin: { select: { id: true, name: true, email: true } },
        },
      },
    },
  });

  if (!message) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(message);
}
