import { prisma } from "@/lib/prisma";
import { generateStorageKey, getStorageProvider } from "@/lib/storage";
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

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const { extension, mimeType } = validated[i];
    const buffer = Buffer.from(await file.arrayBuffer());
    const storageKey = generateStorageKey(extension);

    await storage.save(buffer, { storageKey, mimeType });

    const attachment = await prisma.supportAttachment.create({
      data: {
        messageId,
        originalName: file.name.split(/[/\\]/).pop() ?? file.name,
        mimeType,
        fileSize: buffer.length,
        storageKey,
        uploadedById,
      },
      include: {
        uploadedBy: { select: { name: true } },
      },
    });

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
