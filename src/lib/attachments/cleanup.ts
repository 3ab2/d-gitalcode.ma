import { prisma } from "@/lib/prisma";
import { deleteCloudinaryResource } from "@/lib/cloudinary";
import { getStorageProvider } from "@/lib/storage";

export type AttachmentAsset = {
  id?: string;
  storageKey: string;
  publicId: string | null;
  secureUrl: string | null;
  mimeType: string;
};

export type StagedUpload = {
  publicId: string | null;
  storageKey: string;
  mimeType: string;
  secureUrl: string | null;
};

export async function rollbackStagedUploads(uploads: StagedUpload[]): Promise<void> {
  for (const upload of [...uploads].reverse()) {
    try {
      if (upload.publicId || upload.secureUrl) {
        await deleteCloudinaryResource(
          upload.publicId ?? upload.storageKey,
          upload.mimeType.startsWith("image/") ? "image" : "raw"
        );
      } else {
        const storage = getStorageProvider();
        await storage.delete(upload.storageKey);
      }
    } catch (error) {
      console.warn(
        "[attachments] Rollback failed:",
        upload.publicId ?? upload.storageKey,
        error instanceof Error ? error.message : error
      );
    }
  }
}

export async function purgeAttachmentRecord(
  attachment: AttachmentAsset
): Promise<void> {
  const publicId = attachment.publicId ?? attachment.storageKey;

  if (attachment.publicId || attachment.secureUrl) {
    await deleteCloudinaryResource(
      publicId,
      attachment.mimeType.startsWith("image/") ? "image" : "raw"
    );
    return;
  }

  try {
    const storage = getStorageProvider();
    await storage.delete(attachment.storageKey);
  } catch (error) {
    console.warn(
      "[attachments] Local purge failed:",
      attachment.id ?? attachment.storageKey,
      error instanceof Error ? error.message : error
    );
  }
}

export async function collectUserAttachmentAssets(
  userId: string
): Promise<AttachmentAsset[]> {
  return prisma.supportAttachment.findMany({
    where: {
      OR: [
        { uploadedById: userId },
        { message: { userId } },
        { reply: { message: { userId } } },
      ],
    },
    select: {
      id: true,
      storageKey: true,
      publicId: true,
      secureUrl: true,
      mimeType: true,
    },
  });
}

export async function purgeAttachmentsForUser(userId: string): Promise<void> {
  const attachments = await collectUserAttachmentAssets(userId);
  await Promise.all(attachments.map((a) => purgeAttachmentRecord(a)));
}

export async function purgeAttachmentsForMessage(
  messageId: string
): Promise<void> {
  const attachments = await prisma.supportAttachment.findMany({
    where: { messageId },
    select: {
      id: true,
      storageKey: true,
      publicId: true,
      secureUrl: true,
      mimeType: true,
    },
  });

  await Promise.all(attachments.map((a) => purgeAttachmentRecord(a)));
}
