import { getCloudinaryConfig } from "@/config/cloudinary";
import type { StorageProvider, StoredObject } from "./types";
import {
  deleteCloudinaryResource,
  uploadAttachmentBuffer,
} from "@/lib/cloudinary";

export class CloudinaryStorageProvider implements StorageProvider {
  async save(
    buffer: Buffer,
    options: { storageKey: string; mimeType: string; originalName?: string }
  ): Promise<StoredObject> {
    const result = await uploadAttachmentBuffer(buffer, {
      folder: "dgitalcode/support",
      mimeType: options.mimeType,
      originalName: options.originalName,
    });

    if (!result) {
      throw new Error("Cloudinary upload failed. Check configuration.");
    }

    return {
      storageKey: result.publicId,
      size: buffer.length,
      secureUrl: result.secureUrl,
      publicId: result.publicId,
    };
  }

  async read(storageKey: string): Promise<Buffer> {
    const { cloudName } = getCloudinaryConfig();
    if (!cloudName) {
      throw new Error("Cloudinary is not configured");
    }

    const candidates = [
      `https://res.cloudinary.com/${cloudName}/raw/upload/${storageKey}`,
      `https://res.cloudinary.com/${cloudName}/image/upload/${storageKey}`,
    ];

    for (const url of candidates) {
      const response = await fetch(url);
      if (response.ok) {
        return Buffer.from(await response.arrayBuffer());
      }
    }

    throw new Error(`Failed to fetch attachment from Cloudinary: ${storageKey}`);
  }

  async delete(storageKey: string): Promise<void> {
    await deleteCloudinaryResource(storageKey);
  }

  async exists(storageKey: string): Promise<boolean> {
    try {
      await this.read(storageKey);
      return true;
    } catch {
      return false;
    }
  }
}
