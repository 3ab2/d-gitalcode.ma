import { CloudinaryStorageProvider } from "./cloudinary-provider";
import { LocalStorageProvider } from "./local-provider";
import { isCloudinaryConfigured } from "@/lib/cloudinary";
import type { StorageProvider } from "./types";

let provider: StorageProvider | null = null;

function resolveDriver(): "cloudinary" | "local" {
  const configured = process.env.STORAGE_DRIVER?.toLowerCase();
  if (configured === "local") return "local";
  if (configured === "cloudinary") return "cloudinary";
  return isCloudinaryConfigured() ? "cloudinary" : "local";
}

export function getStorageProvider(): StorageProvider {
  if (!provider) {
    const driver = resolveDriver();
    switch (driver) {
      case "cloudinary":
        provider = new CloudinaryStorageProvider();
        break;
      case "local":
        provider = new LocalStorageProvider();
        break;
      default:
        throw new Error(`Unsupported storage driver: ${driver}`);
    }
  }
  return provider;
}

export function generateStorageKey(extension: string): string {
  const now = new Date();
  const year = now.getUTCFullYear();
  const month = String(now.getUTCMonth() + 1).padStart(2, "0");
  const id = crypto.randomUUID();
  const safeExt = extension.toLowerCase().replace(/[^a-z0-9]/g, "");
  return `support/${year}/${month}/${id}.${safeExt}`;
}

export type { StorageProvider, StoredObject } from "./types";
