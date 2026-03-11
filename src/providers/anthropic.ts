import Anthropic from '@anthropic-ai/sdk';
import type { LLMProvider } from '../types.js';

export class AnthropicProvider implements LLMProvider {
  private client: Anthropic;
  private model: string = 'claude-sonnet-4-20250514';

  constructor(apiKey: string) {
    this.client = new Anthropic({ apiKey });
  }

  async call(prompt: string): Promise<string> {
    const response = await this.client.messages.create({
      model: this.model,
      max_tokens: 1024,
      messages: [{ role: 'user', content: prompt }],
    });

    const block = response.content[0];
    if (!block || block.type !== 'text') throw new Error('Unexpected response type');
    return block.text;
  }
}
