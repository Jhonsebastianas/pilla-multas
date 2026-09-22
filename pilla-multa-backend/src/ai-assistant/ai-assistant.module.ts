import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import {
  ChatSession,
  ChatSessionSchema,
} from './domain/model/document/chat-session.document';
import { AiAssistantService } from './application/ai-assistant.service';
import { AiAssistantController } from './infrastructure/ai-assistant.controller';
import { OpenAiAdapter } from './infrastructure/adapters/openai.adapter';

@Module({
  imports: [
    ConfigModule,
    MongooseModule.forFeature([
      { name: ChatSession.name, schema: ChatSessionSchema },
    ]),
  ],
  controllers: [AiAssistantController],
  providers: [
    AiAssistantService,
    {
      provide: 'IAiProvider',
      useClass: OpenAiAdapter, // Here we inject the preferred adapter (AI Gateway via LiteLLM or direct OpenAI)
    },
  ],
  exports: [AiAssistantService, 'IAiProvider'],
})
export class AiAssistantModule {}
