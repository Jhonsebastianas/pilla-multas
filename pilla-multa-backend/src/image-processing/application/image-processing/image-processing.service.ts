import { Injectable, Logger } from '@nestjs/common';
const sharp = require('sharp');

export interface ProcessedImage {
  buffer: Buffer;
  mimetype: string;
  size: number;
  width: number;
  height: number;
}

@Injectable()
export class ImageProcessingService {
  private readonly logger = new Logger(ImageProcessingService.name);

  async processProductImage(
    buffer: Buffer,
    type: 'normal' | 'thumbnail',
  ): Promise<ProcessedImage> {
    try {
      const image = sharp(buffer);
      const metadata = await image.metadata();

      let pipeline = image.rotate(); // Auto-rotate based on EXIF

      if (type === 'normal') {
        // Resize if it's too large, but keep aspect ratio
        pipeline = pipeline.resize({
          width: 1024,
          height: 1024,
          fit: 'inside',
          withoutEnlargement: true,
        });
      } else if (type === 'thumbnail') {
        // Thumbnail is a small square or small version
        pipeline = pipeline.resize({
          width: 256,
          height: 256,
          fit: 'inside',
          withoutEnlargement: true,
        });
      }

      // Convert to webp
      const { data, info } = await pipeline
        .webp({ effort: 6, quality: 80 })
        .toBuffer({ resolveWithObject: true });

      return {
        buffer: data,
        mimetype: 'image/webp',
        size: info.size,
        width: info.width,
        height: info.height,
      };
    } catch (error) {
      this.logger.error(`Error processing image: ${error.message}`);
      throw new Error('Image processing failed');
    }
  }
}
