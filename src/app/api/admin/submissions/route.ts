import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import type { SubmissionStatus } from "@prisma/client";

export async function GET(request: NextRequest) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status") as SubmissionStatus | null;
  const type = searchParams.get("type");
  const service = searchParams.get("service");
  const search = searchParams.get("search");
  const from = searchParams.get("from");
  const to = searchParams.get("to");

  const submissions = await prisma.contactSubmission.findMany({
    where: {
      ...(status ? { status } : {}),
      ...(type ? { type: type as "GENERAL" | "SERVICE_REQUEST" } : {}),
      ...(service ? { serviceName: { contains: service, mode: "insensitive" } } : {}),
      ...(from || to
        ? {
            createdAt: {
              ...(from ? { gte: new Date(from) } : {}),
              ...(to ? { lte: new Date(to) } : {}),
            },
          }
        : {}),
      ...(search
        ? {
            OR: [
              { name: { contains: search, mode: "insensitive" } },
              { email: { contains: search, mode: "insensitive" } },
              { message: { contains: search, mode: "insensitive" } },
              { serviceName: { contains: search, mode: "insensitive" } },
            ],
          }
        : {}),
    },
    orderBy: { createdAt: "desc" },
    include: {
      service: true,
      replies: { orderBy: { createdAt: "desc" }, take: 1 },
      _count: { select: { replies: true } },
    },
  });

  return NextResponse.json(submissions);
}
