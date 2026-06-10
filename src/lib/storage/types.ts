export interface StoredObject {
  storageKey: string;
  size: number;
}

export interface StorageProvider {
  save(
    buffer: Buffer,
    options: { storageKey: string; mimeType: string }
  ): Promise<StoredObject>;
  read(storageKey: string): Promise<Buffer>;
  delete(storageKey: string): Promise<void>;
  exists(storageKey: string): Promise<boolean>;
}
