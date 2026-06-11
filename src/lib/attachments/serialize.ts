export type SerializedAttachment = {
  id: string;
  originalName: string;
  mimeType: string;
  fileSize: number;
  createdAt: string;
  uploadedById: string;
  uploadedByName?: string | null;
};

type AttachmentSource = {
  id: string;
  originalName: string;
  mimeType: string;
  fileSize: number;
  createdAt: Date;
  uploadedById: string;
  uploadedByName?: string | null;
  uploadedBy?: { name: string | null } | null;
};

export function serializeAttachment(attachment: AttachmentSource): SerializedAttachment {
  return {
    id: attachment.id,
    originalName: attachment.originalName,
    mimeType: attachment.mimeType,
    fileSize: attachment.fileSize,
    createdAt: new Date(attachment.createdAt).toISOString(),
    uploadedById: attachment.uploadedById,
    uploadedByName:
      attachment.uploadedByName ?? attachment.uploadedBy?.name ?? null,
  };
}
