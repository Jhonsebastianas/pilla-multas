import { Global, Module } from '@nestjs/common';
import { DatabaseInitializerService } from './database/database-initializer.service';

@Global()
@Module({
  imports: [],
  providers: [DatabaseInitializerService],
  exports: [],
})
export class CoreModule {}
