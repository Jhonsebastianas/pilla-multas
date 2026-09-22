import { Injectable, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  IStorageProviderToken,
  FileData,
  UploadedFileResult,
} from './storage.provider.interface';
import type { IStorageProvider } from './storage.provider.interface';

@Injectable()
export class StorageService {
  constructor(
    @Inject(IStorageProviderToken)
    private readonly storageProvider: IStorageProvider,
  ) {}

  async uploadFile(
    file: FileData,
    folderPath: string,
    fileName: string,
  ): Promise<UploadedFileResult> {
    return this.storageProvider.uploadFile(file, folderPath, fileName);
  }

  async deleteFile(fileKey: string): Promise<void> {
    return this.storageProvider.deleteFile(fileKey);
  }
}
