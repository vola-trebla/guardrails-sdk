import * as z from 'zod';
import { GeminiProvider } from './providers/gemini.js';
import { generate, metrics } from './generate.js';
import type { GuardrailsConfig, GenerateOptions } from './types.js';
import { AnthropicProvider } from './providers/anthropic.js';

export function createGuardrails(config: GuardrailsConfig) {
  const provider = config.provider === 'gemini'
    ? new GeminiProvider(config.apiKey ?? process.env['GEMINI_API_KEY'] ?? '')
    : new AnthropicProvider(config.apiKey ?? process.env['ANTHROPIC_API_KEY'] ?? '');

  return {
    generate: <T extends z.ZodTypeAny>(options: GenerateOptions<T>) =>
      generate(provider, options, config.maxRetries),
    metrics: () => metrics.summary(),
  };
}

export type { GuardrailsConfig, GenerateOptions } from './types.js';
