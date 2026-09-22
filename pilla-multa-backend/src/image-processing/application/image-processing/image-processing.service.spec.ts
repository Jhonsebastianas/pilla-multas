import { Test, TestingModule } from '@nestjs/testing';
import { ImageProcessingService } from './image-processing.service';
import sharp from 'sharp';

// Mock sharp module
jest.mock('sharp', () => {
  const mockSharp = jest.fn();
  const mockPipeline = {
    metadata: jest.fn().mockResolvedValue({ width: 800, height: 600 }),
    rotate: jest.fn().mockReturnThis(),
    resize: jest.fn().mockReturnThis(),
    webp: jest.fn().mockReturnThis(),
    toBuffer: jest.fn().mockResolvedValue({
      data: Buffer.from('mock-webp'),
      info: { size: 1234, width: 800, height: 600 }
    })
  };
  
  mockSharp.mockReturnValue(mockPipeline);
  return {
    __esModule: true,
    default: mockSharp
  };
});

describe('ImageProcessingService', () => {
  let service: ImageProcessingService;

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [ImageProcessingService],
    }).compile();

    service = module.get<ImageProcessingService>(ImageProcessingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('processProductImage', () => {
    const mockBuffer = Buffer.from('test-image');

    it('should process a normal image correctly', async () => {
      const result = await service.processProductImage(mockBuffer, 'normal');

      expect(sharp).toHaveBeenCalledWith(mockBuffer);
      const mockPipeline = (sharp as unknown as jest.Mock)();
      
      expect(mockPipeline.resize).toHaveBeenCalledWith(expect.objectContaining({
        width: 1024,
        height: 1024,
      }));
      expect(mockPipeline.webp).toHaveBeenCalledWith({ effort: 6, quality: 80 });
      expect(result).toEqual({
        buffer: Buffer.from('mock-webp'),
        mimetype: 'image/webp',
        size: 1234,
        width: 800,
        height: 600,
      });
    });

    it('should process a thumbnail image correctly', async () => {
      const result = await service.processProductImage(mockBuffer, 'thumbnail');

      expect(sharp).toHaveBeenCalledWith(mockBuffer);
      const mockPipeline = (sharp as unknown as jest.Mock)();
      
      expect(mockPipeline.resize).toHaveBeenCalledWith(expect.objectContaining({
        width: 256,
        height: 256,
      }));
      expect(mockPipeline.webp).toHaveBeenCalledWith({ effort: 6, quality: 80 });
    });
  });
});

