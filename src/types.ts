import * as z from 'zod';

export interface GuardrailsConfig {
  provider: 'gemini' | 'openai';
  maxRetries: number;
  apiKey?: string;
}

export interface GenerateOptions<T extends z.ZodTypeAny> {
  schema: T;
  prompt: string;
}

export interface GenerateResult<T> {
  data: T;
  attempts: number;
  success: boolean;
}

export interface LLMProvider {
  call(prompt: string): Promise<string>;
}
