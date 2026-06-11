export interface StoredObject {
  storageKey: string;
  size: number;
  secureUrl?: string;
  publicId?: string;
}

export interface StorageProvider {
  save(
    buffer: Buffer,
    options: { storageKey: string; mimeType: string; originalName?: string }
  ): Promise<StoredObject>;
  read(storageKey: string): Promise<Buffer>;
  delete(storageKey: string): Promise<void>;
  exists(storageKey: string): Promise<boolean>;
}
