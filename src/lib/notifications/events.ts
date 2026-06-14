import { prisma } from "@/lib/prisma";
import { createNotification } from "./service";

export async function notifyAdminsNewLead(input: {
  submissionId: string;
  name: string;
  email: string;
  serviceName?: string | null;
  sourcePage?: string | null;
}) {
  const admins = await prisma.user.findMany({
    where: { role: "ADMIN", active: true },
    select: { id: true },
  });

  if (admins.length === 0) return;

  const serviceLabel = input.serviceName ? ` — ${input.serviceName}` : "";
  const sourceLabel = input.sourcePage ? ` (${input.sourcePage})` : "";

  await Promise.all(
    admins.map((admin) =>
      createNotification({
        userId: admin.id,
        type: "NEW_LEAD",
        title: "New lead",
        message: `${input.name} submitted a contact request${serviceLabel}${sourceLabel}`,
        metadata: {
          submissionId: input.submissionId,
          email: input.email,
          href: `/admin/submissions?id=${input.submissionId}`,
        },
      })
    )
  );
}
