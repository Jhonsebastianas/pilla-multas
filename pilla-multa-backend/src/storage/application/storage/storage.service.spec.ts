import { Test, TestingModule } from '@nestjs/testing';
import { StorageService } from './storage.service';
import { IStorageProviderToken, IStorageProvider } from './storage.provider.interface';

describe('StorageService', () => {
  let service: StorageService;
  let mockProvider: jest.Mocked<IStorageProvider>;

  beforeEach(async () => {
    mockProvider = {
      uploadFile: jest.fn(),
      deleteFile: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StorageService,
        {
          provide: IStorageProviderToken,
          useValue: mockProvider,
        },
      ],
    }).compile();

    service = module.get<StorageService>(StorageService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('uploadFile', () => {
    it('should call the provider uploadFile method', async () => {
      const mockResult = { url: 'http://test.com/file.jpg', fileKey: 'file.jpg', storageType: 'LOCAL' as const };
      mockProvider.uploadFile.mockResolvedValue(mockResult);

      const fileData = { buffer: Buffer.from('test'), mimetype: 'image/jpeg', originalname: 'file.jpg', size: 4 };
      const result = await service.uploadFile(fileData, 'test-folder', 'file.jpg');

      expect(mockProvider.uploadFile).toHaveBeenCalledWith(fileData, 'test-folder', 'file.jpg');
      expect(result).toEqual(mockResult);
    });
  });

  describe('deleteFile', () => {
    it('should call the provider deleteFile method', async () => {
      mockProvider.deleteFile.mockResolvedValue();

      await service.deleteFile('file.jpg');

      expect(mockProvider.deleteFile).toHaveBeenCalledWith('file.jpg');
    });
  });
});

