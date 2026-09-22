import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AiAssistantModule } from './ai-assistant/ai-assistant.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { InfractionModule } from './infraction/infraction.module';
import { QueueModule } from './queue/queue.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('DB_URI', 'mongodb://localhost:27017/pilla-multa'),
      }),
      inject: [ConfigService],
    }),
    QueueModule,
    AiAssistantModule,
    InfractionModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
