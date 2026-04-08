import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenerativeAI } from '@google/generative-ai';
import type {
  GenerativeModel,
  GenerateContentResult,
  Part,
} from '@google/generative-ai';

@Injectable()
export class ApplicationEvaluationAiService {
  private genAI: GoogleGenerativeAI | null = null;

  constructor(
    private readonly configService: ConfigService<Record<string, string>>,
  ) {}

  isEnabled(): boolean {
    return Boolean(this.configService.get<string>('GOOGLE_AI_API_KEY'));
  }

  async generateFeedback(prompt: {
    systemPrompt: string;
    userPrompt: string;
  }): Promise<string> {
    const modelName =
      this.configService.get<string>('GOOGLE_AI_MODEL') ??
      'gemini-flash-latest';

    const model: GenerativeModel = this.getClient().getGenerativeModel({
      model: modelName,
    });

    const result: GenerateContentResult = await model.generateContent({
      systemInstruction: {
        role: 'system',
        parts: [{ text: prompt.systemPrompt }],
      },
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: prompt.userPrompt,
            },
          ],
        },
      ],
      generationConfig: {
        temperature: 0.8,
      },
    });

    const candidate = result.response?.candidates?.[0];
    const finish = candidate?.finishReason
      ? String(candidate.finishReason)
      : undefined;
    if (finish && finish !== 'STOP') {
      throw new Error(`Gemini yanıtı tamamlanmadı: ${finish}`);
    }

    const contentParts: Part[] = candidate?.content?.parts ?? [];
    const text = contentParts
      .map((part) => part.text ?? '')
      .filter(Boolean)
      .join('\n')
      .trim();

    if (!text) {
      throw new Error('Gemini boş yanıt döndürdü');
    }

    return text;
  }

  private getClient(): GoogleGenerativeAI {
    if (this.genAI) {
      return this.genAI;
    }

    const apiKey = this.configService.get<string>('GOOGLE_AI_API_KEY');
    if (!apiKey) {
      throw new Error('GOOGLE_AI_API_KEY ayarlanmamış.');
    }

    this.genAI = new GoogleGenerativeAI(apiKey);
    return this.genAI;
  }
}
