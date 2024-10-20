export class UploadFailedError extends Error {
  constructor(key: string) {
    super(`Failed to upload file with key ${key}`);
  }
}

export class GetSignedUrlFailedError extends Error {
  constructor(key: string) {
    super(`Failed to get signed url for file with key ${key}`);
  }
}
