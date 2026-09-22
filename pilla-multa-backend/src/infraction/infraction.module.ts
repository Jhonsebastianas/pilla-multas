import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Infraction, InfractionSchema } from './domain/model/document/infraction.document';
import { InfractionService } from './application/infraction.service';
import { InfractionController } from './infrastructure/infraction.controller';
import { StorageModule } from '@storage/storage.module';
import { AiAssistantModule } from '../ai-assistant/ai-assistant.module';

import { InfractionSyncValidatorService } from './application/infraction-sync-validator.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Infraction.name, schema: InfractionSchema },
    ]),
    StorageModule,
    AiAssistantModule,
  ],
  controllers: [InfractionController],
  providers: [InfractionService, InfractionSyncValidatorService],
  exports: [InfractionService],
})
export class InfractionModule {}
