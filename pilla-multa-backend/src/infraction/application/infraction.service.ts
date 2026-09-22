import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { StorageService } from '@storage/application/storage/storage.service';
import { QueueService } from '@queue/application/queue.service';
import { Infraction, InfractionDocument } from '../domain/model/document/infraction.document';

@Injectable()
export class InfractionService {
  constructor(
    @InjectModel(Infraction.name) private infractionModel: Model<InfractionDocument>,
    private storageService: StorageService,
    private queueService: QueueService,
  ) {}

  async reportInfraction(
    userId: string,
    file: Express.Multer.File,
    latitude: number,
    longitude: number,
    description?: string,
  ): Promise<InfractionDocument> {
    if (!file) {
      throw new BadRequestException('Image file is required');
    }

    // Upload to storage (e.g. S3 or Local)
    const folderPath = `infractions/${userId}`;
    const fileName = `${Date.now()}-${file.originalname}`;
    
    const fileData = {
      buffer: file.buffer,
      mimetype: file.mimetype,
      originalname: file.originalname,
      size: file.size,
    };

    const uploadedResult = await this.storageService.uploadFile(
      fileData,
      folderPath,
      fileName,
    );

    // Create infraction record
    const infraction = new this.infractionModel({
      idUser: new Types.ObjectId(userId),
      imageUrl: uploadedResult.url,
      latitude,
      longitude,
      description,
    });

    const savedInfraction = await infraction.save();

    // Trigger AI Validation in background using BullMQ
    await this.queueService.addJob(
      'ai-validation', // Queues should be adapted in QueueModule as discussed previously
      'validate-infraction-image',
      {
        infractionId: savedInfraction._id.toString(),
        imageUrl: savedInfraction.imageUrl,
      },
    );

    return savedInfraction;
  }

  async getInfractionsByUser(userId: string): Promise<InfractionDocument[]> {
    return this.infractionModel
      .find({ idUser: new Types.ObjectId(userId) })
      .sort({ createdAt: -1 })
      .exec();
  }
}
