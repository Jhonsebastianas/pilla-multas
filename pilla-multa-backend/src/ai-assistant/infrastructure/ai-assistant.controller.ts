import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Body,
  Param,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  Headers,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AiAssistantService } from '../application/ai-assistant.service';

@Controller('ai-assistant')
@ApiTags('ai-assistant')
export class AiAssistantController {
  constructor(private readonly aiAssistantService: AiAssistantService) {}

  // For testing purposes, we use a simple header 'x-user-id'. In a real scenario, use Guards.
  private getUserId(headers: Record<string, string>): string {
    const userId = headers['x-user-id'];
    if (!userId) {
      // Mock user ID if not provided, just for initial testing
      return '65b2d2f8e1234567890abcde'; 
    }
    return userId;
  }

  @Post('chat')
  @ApiOperation({
    description: 'Send a prompt with context to the AI Assistant.',
  })
  async chat(
    @Headers() headers: Record<string, string>,
    @Body() body: { prompt: string; sessionId?: string; contextInfo?: any },
  ) {
    const userId = this.getUserId(headers);
    return await this.aiAssistantService.sendMessage(
      userId,
      body.prompt,
      body.sessionId,
      body.contextInfo,
    );
  }

  @Post('transcribe')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ description: 'Transcribe an audio file to text using AI.' })
  async transcribe(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No audio file provided.');
    }
    const text = await this.aiAssistantService.transcribeAudio(file);
    return { text };
  }

  @Get('sessions')
  @ApiOperation({ description: 'List all chat sessions for the current user.' })
  async getSessions(@Headers() headers: Record<string, string>) {
    const userId = this.getUserId(headers);
    return await this.aiAssistantService.getSessionsByUser(userId);
  }

  @Get('sessions/:id')
  @ApiOperation({ description: 'Get a specific chat session by id.' })
  async getSessionById(
    @Headers() headers: Record<string, string>,
    @Param('id') id: string,
  ) {
    const userId = this.getUserId(headers);
    return await this.aiAssistantService.getSessionById(id, userId);
  }

  @Put('sessions/:id/title')
  @ApiOperation({ description: 'Update the title of a specific session.' })
  async updateSessionTitle(
    @Headers() headers: Record<string, string>,
    @Param('id') id: string,
    @Body() body: { title: string },
  ) {
    const userId = this.getUserId(headers);
    return await this.aiAssistantService.updateSessionTitle(
      id,
      userId,
      body.title,
    );
  }

  @Delete('sessions/:id')
  @ApiOperation({ description: 'Delete a specific chat session.' })
  async deleteSession(
    @Headers() headers: Record<string, string>,
    @Param('id') id: string,
  ) {
    const userId = this.getUserId(headers);
    await this.aiAssistantService.deleteSession(id, userId);
    return { success: true };
  }
}
