import { Injectable, BadRequestException } from '@nestjs/common';
import { StorageService } from '@storage/application/storage/storage.service';
import * as aiProviderInterface from '../../ai-assistant/application/ai-provider.interface';
import { Inject } from '@nestjs/common';

@Injectable()
export class InfractionSyncValidatorService {
  constructor(
    private storageService: StorageService,
    @Inject('IAiProvider') private aiProvider: aiProviderInterface.IAiProvider,
  ) { }

  async validateImageSync(file: Express.Multer.File): Promise<any> {
    if (!file) throw new BadRequestException('No image provided');

    // Convert image to base64 to send to OpenAI Vision
    const base64Image = file.buffer.toString('base64');
    const imageUrl = `data:${file.mimetype};base64,${base64Image}`;

    const response = await this.aiProvider.generateResponse([
      {
        role: 'system',
        content: `Eres un validador de infracciones de tránsito experto. 
Analiza la imagen provista y determina si hay una infracción de tránsito.
Responde en formato JSON estricto con:
{
  "isInfraction": boolean,
  "confidence": number, // 0 to 1
  "plateDetected": string | null,
  "infractionType": string | null,
  "explanation": string
}`
      },
      {
        role: 'user',
        // Note: OpenAI adapter must support image content format for vision.
        // Assuming the generic generateResponse will pass it correctly if we format it like this,
        // or we just pass the text and OpenAI handles it if LiteLLM proxy handles it.
        // For standard OpenAI structure:
        content: [
          { type: 'text', text: 'Analiza esta imagen.' },
          { type: 'image_url', image_url: { url: imageUrl } }
        ] as any
      }
    ]);

    let parsedResult;
    try {
      const content = response.content.replace(/```json/g, '').replace(/```/g, '').trim();
      parsedResult = JSON.parse(content);
    } catch (e) {
      parsedResult = { raw: response.content, error: "Failed to parse JSON" };
    }

    return parsedResult;
  }
}
