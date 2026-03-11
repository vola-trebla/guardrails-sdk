import { GoogleGenerativeAI } from '@google/generative-ai';
import type { LLMProvider } from '../types.js';

export class GeminiProvider implements LLMProvider {
  private client: GoogleGenerativeAI;
  private model: string = 'gemini-2.5-flash';

  constructor(apiKey: string) {
    this.client = new GoogleGenerativeAI(apiKey);
  }

  async call(prompt: string): Promise<string> {
    const model = this.client.getGenerativeModel({ model: this.model });
    const result = await model.generateContent(prompt);
    return result.response.text();
  }
}