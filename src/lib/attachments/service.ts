import { prisma } from "@/lib/prisma";
import { generateStorageKey, getStorageProvider } from "@/lib/storage";
import { isCloudinaryConfigured } from "@/lib/cloudinary";
import {
  rollbackStagedUploads,
  type StagedUpload,
} from "@/lib/attachments/cleanup";
import {
  AttachmentValidationError,
  validateAttachmentFiles,
} from "./validation";

export type AttachmentRecord = {
  id: string;
  originalName: string;
  mimeType: string;
  fileSize: number;
  createdAt: Date;
  uploadedById: string;
  uploadedByName?: string | null;
};

export async function saveMessageAttachments(
  messageId: string,
  uploadedById: string,
  files: File[]
): Promise<AttachmentRecord[]> {
  if (files.length === 0) return [];

  const validated = validateAttachmentFiles(files);
  const storage = getStorageProvider();
  const records: AttachmentRecord[] = [];
  const staged: StagedUpload[] = [];
  const createdAttachmentIds: string[] = [];

  try {
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const { extension, mimeType } = validated[i];
      const buffer = Buffer.from(await file.arrayBuffer());
      const originalName = file.name.split(/[/\\]/).pop() ?? file.name;
      const storageKey = generateStorageKey(extension);

      let stored;
      try {
        stored = await storage.save(buffer, {
          storageKey,
          mimeType,
          originalName,
        });
      } catch (error) {
        console.error(
          "[attachments] Upload failed:",
          error instanceof Error ? error.message : error
        );
        throw new AttachmentValidationError(
          "invalid_filename",
          isCloudinaryConfigured()
            ? "File upload failed. Please try again."
            : "File storage is not configured for production."
        );
      }

      const stagedUpload: StagedUpload = {
        publicId: stored.publicId ?? null,
        storageKey: stored.publicId ?? stored.storageKey,
        mimeType,
        secureUrl: stored.secureUrl ?? null,
      };
      staged.push(stagedUpload);

      const attachment = await prisma.supportAttachment.create({
        data: {
          messageId,
          originalName,
          mimeType,
          fileSize: buffer.length,
          storageKey: stagedUpload.storageKey,
          secureUrl: stagedUpload.secureUrl,
          publicId: stagedUpload.publicId,
          uploadedById,
        },
        include: {
          uploadedBy: { select: { name: true } },
        },
      });

      createdAttachmentIds.push(attachment.id);

      records.push({
        id: attachment.id,
        originalName: attachment.originalName,
        mimeType: attachment.mimeType,
        fileSize: attachment.fileSize,
        createdAt: attachment.createdAt,
        uploadedById: attachment.uploadedById,
        uploadedByName: attachment.uploadedBy.name,
      });
    }

    return records;
  } catch (error) {
    if (createdAttachmentIds.length > 0) {
      await prisma.supportAttachment
        .deleteMany({ where: { id: { in: createdAttachmentIds } } })
        .catch((deleteError) => {
          console.error(
            "[attachments] Failed to rollback DB records:",
            deleteError instanceof Error ? deleteError.message : deleteError
          );
        });
    }

    await rollbackStagedUploads(staged);
    throw error;
  }
}

export async function getAttachmentBuffer(attachmentId: string): Promise<{
  buffer: Buffer;
  mimeType: string;
  originalName: string;
  fileSize: number;
} | null> {
  const attachment = await prisma.supportAttachment.findUnique({
    where: { id: attachmentId },
  });

  if (!attachment) return null;

  if (attachment.secureUrl) {
    try {
      const response = await fetch(attachment.secureUrl);
      if (!response.ok) return null;
      const buffer = Buffer.from(await response.arrayBuffer());
      return {
        buffer,
        mimeType: attachment.mimeType,
        originalName: attachment.originalName,
        fileSize: attachment.fileSize,
      };
    } catch (error) {
      console.error(
        "[attachments] Cloudinary fetch failed:",
        error instanceof Error ? error.message : error
      );
      return null;
    }
  }

  const storage = getStorageProvider();
  const exists = await storage.exists(attachment.storageKey);
  if (!exists) return null;

  const buffer = await storage.read(attachment.storageKey);

  return {
    buffer,
    mimeType: attachment.mimeType,
    originalName: attachment.originalName,
    fileSize: attachment.fileSize,
  };
}

export { AttachmentValidationError };
