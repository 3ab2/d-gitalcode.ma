import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { logError } from "@/lib/logger";

const LEGACY_NOTIFICATION_TYPES = ["SUPPORT_REPLY", "NEW_MESSAGE"] as const;

let legacyPurgeAttempted = false;

export function isLegacyNotificationEnumError(error: unknown): boolean {
  if (
    !(error instanceof Prisma.PrismaClientUnknownRequestError) &&
    !(error instanceof Prisma.PrismaClientKnownRequestError)
  ) {
    return false;
  }

  const message = error.message;
  return (
    message.includes("NotificationType") &&
    LEGACY_NOTIFICATION_TYPES.some((type) => message.includes(type))
  );
}

/**
 * Removes notification rows left over from pre-migration enum values.
 * Safe to run repeatedly; uses raw SQL so Prisma enum mapping is not required.
 */
export async function purgeLegacyNotificationRows(): Promise<void> {
  try {
    await prisma.$executeRaw`
      DELETE FROM "Notification"
      WHERE "type"::text IN ('SUPPORT_REPLY', 'NEW_MESSAGE')
    `;
  } catch (error) {
    logError("notifications", error, { event: "legacy_purge_failed" });
  }
}

export async function ensureLegacyNotificationsPurged(): Promise<void> {
  if (legacyPurgeAttempted) return;
  legacyPurgeAttempted = true;
  await purgeLegacyNotificationRows();
}
