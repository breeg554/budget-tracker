export class CreateDirectoryFailedError extends Error {
  constructor(path: string) {
    super(`Failed to create directory ${path}`);
  }
}
