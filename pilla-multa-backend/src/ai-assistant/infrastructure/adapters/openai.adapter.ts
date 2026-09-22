import { Injectable, Logger } from '@nestjs/common';
import {
  IAiProvider,
  AiMessage,
  AiResponse,
} from '../../application/ai-provider.interface';
import OpenAI, { toFile } from 'openai';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class OpenAiAdapter implements IAiProvider {
  private openai: OpenAI;
  private readonly logger = new Logger(OpenAiAdapter.name);

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('OPENAI_API_KEY');
    if (!apiKey) {
      this.logger.warn(
        'OPENAI_API_KEY is not defined in environment variables. OpenAI will not work properly.',
      );
      // Initialize with dummy to avoid crashes, actual calls will fail
      this.openai = new OpenAI({ apiKey: 'dummy' });
    } else {
      const baseURL =
        this.configService.get<string>('LITELLM_URL') ||
        'http://localhost:4000/v1';
      // LiteLLM requires its own Virtual Key or Master Key to authenticate the proxy request, NOT the OpenAI key.
      const proxyKey =
        this.configService.get<string>('LITELLM_MASTER_KEY') ||
        'sk-1234-master-key';

      this.openai = new OpenAI({
        apiKey: proxyKey,
        baseURL,
      });
    }
  }

  private handleError(operation: string, error: any): never {
    const errorCode = Math.random().toString(36).substring(2, 10).toUpperCase();
    this.logger.error(
      `[ERR-${errorCode}] Error during AI operation: ${operation}`,
      error,
    );
    // Return a generic, user-friendly message with the error code so it can be traced in logs
    throw new Error(
      `Ocurrió un error inesperado al procesar la solicitud con Inteligencia Artificial. Por favor, contacta a soporte e indica el código de error: ERR-${errorCode}`,
    );
  }

  async generateResponse(
    messages: AiMessage[],
    tools?: any[],
  ): Promise<AiResponse> {
    try {
      const model = this.configService.get<string>('AI_CHAT_MODEL') || 'gpt-4o-mini';
      const payload: any = {
        model: model,
        messages: messages,
      };

      if (tools && tools.length > 0) {
        payload.tools = tools;
      }

      const response = await this.openai.chat.completions.create(payload);
      const choice = response.choices[0]?.message;

      return {
        content: choice?.content || undefined,
        toolCalls: choice?.tool_calls as any,
      };
    } catch (error) {
      this.handleError('generateResponse', error);
    }
  }

  async generateEmbedding(text: string): Promise<number[]> {
    try {
      const model = this.configService.get<string>('AI_EMBEDDING_MODEL') || 'text-embedding-3-small';
      const response = await this.openai.embeddings.create({
        model: model,
        input: text,
      });
      return response.data[0].embedding;
    } catch (error) {
      this.handleError('generateEmbedding', error);
    }
  }

  async transcribeAudio(fileBuffer: Buffer, fileName: string): Promise<string> {
    try {
      const model = this.configService.get<string>('AI_AUDIO_MODEL') || 'whisper-1';
      const file = await toFile(fileBuffer, fileName);
      const response = await this.openai.audio.transcriptions.create({
        file: file,
        model: model,
        language: 'es',
        // Biases Whisper toward POS/inventory vocabulary and reduces chance of hallucinations
        prompt:
          'inventario, ventas, productos, precio, cantidad, factura, cliente, reporte',
      });

      const text = response.text?.trim() ?? '';

      // Filter known Whisper hallucination strings that appear on silent/empty audio
      const WHISPER_HALLUCINATIONS = [
        'subtítulos realizados por la comunidad de amara.org',
        'subtitulos realizados por la comunidad de amara.org',
        'amara.org',
        'suscríbete',
        'subtitulado por',
      ];

      const isHallucination = WHISPER_HALLUCINATIONS.some((h) =>
        text.toLowerCase().includes(h),
      );

      if (isHallucination || text.length === 0) {
        this.logger.warn(
          'Whisper returned a hallucination or empty text. Audio may be silent.',
        );
        return '';
      }

      return text;
    } catch (error) {
      this.handleError('transcribeAudio', error);
    }
  }
}
