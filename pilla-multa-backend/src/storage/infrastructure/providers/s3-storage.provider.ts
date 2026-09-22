import { Injectable, Logger } from '@nestjs/common';
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';
import {
  FileData,
  IStorageProvider,
  UploadedFileResult,
} from '../../application/storage/storage.provider.interface';

@Injectable()
export class S3StorageProvider implements IStorageProvider {
  private readonly logger = new Logger(S3StorageProvider.name);
  private readonly s3Client: S3Client;
  private readonly bucket: string;
  private readonly baseUrl: string;

  constructor(private readonly configService: ConfigService) {
    this.bucket = this.configService.get<string>('AWS_S3_BUCKET') || '';
    const region = this.configService.get<string>('AWS_REGION') || 'us-east-1';

    this.s3Client = new S3Client({
      region,
      credentials: {
        accessKeyId: this.configService.get<string>('AWS_ACCESS_KEY_ID') || '',
        secretAccessKey:
          this.configService.get<string>('AWS_SECRET_ACCESS_KEY') || '',
      },
    });

    this.baseUrl = `https://${this.bucket}.s3.${region}.amazonaws.com`;
  }

  async uploadFile(
    file: FileData,
    folderPath: string,
    fileName: string,
  ): Promise<UploadedFileResult> {
    const fileKey = `${folderPath}/${fileName}`.replace(/^\//, ''); // Remove leading slash if any

    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: fileKey,
      Body: file.buffer,
      ContentType: file.mimetype,
    });

    try {
      await this.s3Client.send(command);
      return {
        url: `${this.baseUrl}/${fileKey}`,
        fileKey: fileKey,
        storageType: 'S3',
      };
    } catch (error) {
      this.logger.error(`Error uploading file to S3: ${error.message}`);
      throw error;
    }
  }

  async deleteFile(fileKey: string): Promise<void> {
    const command = new DeleteObjectCommand({
      Bucket: this.bucket,
      Key: fileKey,
    });

    try {
      await this.s3Client.send(command);
    } catch (error) {
      this.logger.error(`Error deleting file from S3: ${error.message}`);
      throw error;
    }
  }
}
