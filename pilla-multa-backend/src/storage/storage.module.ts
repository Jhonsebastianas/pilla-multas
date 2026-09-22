import { Module } from '@nestjs/common';
import { StorageService } from './application/storage/storage.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { IStorageProviderToken } from './application/storage/storage.provider.interface';
import { S3StorageProvider } from './infrastructure/providers/s3-storage.provider';
import { LocalStorageProvider } from './infrastructure/providers/local-storage.provider';
import { UploadsController } from './infrastructure/uploads.controller';

@Module({
  imports: [ConfigModule],
  controllers: [UploadsController],
  providers: [
    {
      provide: IStorageProviderToken,
      useFactory: (configService: ConfigService) => {
        const providerType = configService.get<string>('STORAGE_PROVIDER');
        if (providerType === 'S3') {
          return new S3StorageProvider(configService);
        }
        return new LocalStorageProvider(configService);
      },
      inject: [ConfigService],
    },
    StorageService,
  ],
  exports: [StorageService],
})
export class StorageModule {}
