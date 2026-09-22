export interface FileData {
  buffer: Buffer;
  mimetype: string;
  originalname: string;
  size: number;
}

export interface UploadedFileResult {
  url: string;
  fileKey: string;
  storageType: 'LOCAL' | 'S3';
}

export const IStorageProviderToken = Symbol('IStorageProvider');

export interface IStorageProvider {
  uploadFile(
    file: FileData,
    folderPath: string,
    fileName: string,
  ): Promise<UploadedFileResult>;
  deleteFile(fileKey: string): Promise<void>;
}
