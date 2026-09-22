import { Injectable, Logger } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { ConfigService } from '@nestjs/config';
import {
  FileData,
  IStorageProvider,
  UploadedFileResult,
} from '../../application/storage/storage.provider.interface';

@Injectable()
export class LocalStorageProvider implements IStorageProvider {
  private readonly logger = new Logger(LocalStorageProvider.name);
  private readonly uploadDir: string;
  private readonly baseUrl: string;

  constructor(private readonly configService: ConfigService) {
    this.uploadDir = path.resolve(process.cwd(), 'uploads');
    // Determine base URL, assuming backend runs on API_URL or a default
    this.baseUrl =
      this.configService.get<string>('API_URL') || 'http://localhost:3000';
  }

  private async ensureDirectoryExists(dirPath: string): Promise<void> {
    if (!fs.existsSync(dirPath)) {
      await fs.promises.mkdir(dirPath, { recursive: true });
    }
  }

  async uploadFile(
    file: FileData,
    folderPath: string,
    fileName: string,
  ): Promise<UploadedFileResult> {
    // Relative path used for the URL
    const fileKey = path.posix
      .join('uploads', folderPath, fileName)
      .replace(/^\//, '');

    // Absolute path for saving on disk
    const absoluteFolderPath = path.join(this.uploadDir, folderPath);
    const absoluteFilePath = path.join(absoluteFolderPath, fileName);

    try {
      await this.ensureDirectoryExists(absoluteFolderPath);
      await fs.promises.writeFile(absoluteFilePath, new Uint8Array(file.buffer));

      return {
        url: `${this.baseUrl}/${fileKey}`,
        fileKey: fileKey,
        storageType: 'LOCAL',
      };
    } catch (error) {
      this.logger.error(`Error saving local file: ${error.message}`);
      throw error;
    }
  }

  async deleteFile(fileKey: string): Promise<void> {
    const absoluteFilePath = path.resolve(process.cwd(), fileKey);

    try {
      if (fs.existsSync(absoluteFilePath)) {
        await fs.promises.unlink(absoluteFilePath);
      }
    } catch (error) {
      this.logger.error(`Error deleting local file: ${error.message}`);
      throw error;
    }
  }
}
