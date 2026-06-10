import { mkdir, readFile, unlink, writeFile, access } from "fs/promises";
import path from "path";
import type { StorageProvider, StoredObject } from "./types";

function resolveStorageRoot(): string {
  const root = process.env.STORAGE_LOCAL_PATH ?? path.join(process.cwd(), "uploads");
  return path.resolve(root);
}

function resolveObjectPath(storageKey: string): string {
  const root = resolveStorageRoot();
  const normalized = path.normalize(storageKey).replace(/^(\.\.(\/|\\|$))+/, "");
  const fullPath = path.join(root, normalized);

  if (!fullPath.startsWith(root + path.sep) && fullPath !== root) {
    throw new Error("Invalid storage key: path traversal detected");
  }

  return fullPath;
}

export class LocalStorageProvider implements StorageProvider {
  async save(
    buffer: Buffer,
    options: { storageKey: string; mimeType: string }
  ): Promise<StoredObject> {
    const filePath = resolveObjectPath(options.storageKey);
    await mkdir(path.dirname(filePath), { recursive: true });
    await writeFile(filePath, buffer);

    return {
      storageKey: options.storageKey,
      size: buffer.length,
    };
  }

  async read(storageKey: string): Promise<Buffer> {
    const filePath = resolveObjectPath(storageKey);
    return readFile(filePath);
  }

  async delete(storageKey: string): Promise<void> {
    const filePath = resolveObjectPath(storageKey);
    await unlink(filePath);
  }

  async exists(storageKey: string): Promise<boolean> {
    try {
      await access(resolveObjectPath(storageKey));
      return true;
    } catch {
      return false;
    }
  }
}
