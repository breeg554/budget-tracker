export type StorageUploadMetadata = {
  name: string;
  mimetype: string;
  size: number;
  key: string;
};

export abstract class StorageClient {
  getSignedUrl: (key: string) => Promise<string>;
  upload: (
    file: Buffer,
    metadata: StorageUploadMetadata,
  ) => Promise<{ key: string }>;
}
