import { Injectable, OnModuleInit } from '@nestjs/common';

@Injectable()
export class DatabaseInitializerService implements OnModuleInit {
  constructor() {}

  async onModuleInit() {
    // Simplified database initialization for Pilla Multa App
    console.log('DatabaseInitializerService initialized.');
  }
}
