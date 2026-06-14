import { prisma } from "@/lib/prisma";
import { DUPLICATE_WINDOW_MS } from "@/lib/contact-validation";

export async function findRecentDuplicateLead(
  email: string,
  message: string
): Promise<{ id: string } | null> {
  const since = new Date(Date.now() - DUPLICATE_WINDOW_MS);

  return prisma.contactSubmission.findFirst({
    where: {
      email: email.toLowerCase(),
      message,
      createdAt: { gte: since },
    },
    select: { id: true },
  });
}

export async function getLeadStats() {
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const [newLeads, inProgress, closedToday, totalToday] = await Promise.all([
    prisma.contactSubmission.count({ where: { status: "NEW" } }),
    prisma.contactSubmission.count({
      where: { status: { in: ["IN_PROGRESS", "READ", "REPLIED"] } },
    }),
    prisma.contactSubmission.count({
      where: {
        status: "CLOSED",
        updatedAt: { gte: startOfToday },
      },
    }),
    prisma.contactSubmission.count({
      where: { createdAt: { gte: startOfToday } },
    }),
  ]);

  return { newLeads, inProgress, closedToday, totalToday };
}
