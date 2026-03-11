import * as z from 'zod';
import { GeminiProvider } from './providers/gemini.js';
import { generate, metrics } from './generate.js';
import type { GuardrailsConfig, GenerateOptions } from './types.js';

export function createGuardrails(config: GuardrailsConfig) {
  const provider = config.provider === 'gemini'
    ? new GeminiProvider(config.apiKey ?? process.env['GEMINI_API_KEY'] ?? '')
    : (() => { throw new Error('OpenAI not implemented yet'); })();

  return {
    generate: <T extends z.ZodTypeAny>(options: GenerateOptions<T>) =>
      generate(provider, options, config.maxRetries),
    metrics: () => metrics.summary(),
  };
}

export type { GuardrailsConfig, GenerateOptions } from './types.js';
