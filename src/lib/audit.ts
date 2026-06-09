import type { Prisma } from "@prisma/client";
import { prisma } from "./prisma";

interface AuditParams {
  userId: string;
  userEmail?: string | null;
  action: "CREATE" | "UPDATE" | "DELETE" | "REPLY" | "PUBLISH" | "UNPUBLISH";
  entity: string;
  entityId?: string;
  metadata?: Prisma.InputJsonValue;
}

export async function logAdminAction(params: AuditParams) {
  try {
    await prisma.adminAuditLog.create({
      data: {
        userId: params.userId,
        userEmail: params.userEmail ?? undefined,
        action: params.action,
        entity: params.entity,
        entityId: params.entityId,
        metadata: params.metadata ?? undefined,
      },
    });
  } catch (error) {
    console.error("Failed to log admin action:", error);
  }
}
