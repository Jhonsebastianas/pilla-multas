import { Module } from '@nestjs/common';
import { ImageProcessingService } from './application/image-processing/image-processing.service';

@Module({
  providers: [ImageProcessingService],
  exports: [ImageProcessingService],
})
export class ImageProcessingModule {}
