import * as z from 'zod';
import { repairJson } from './repair.js';
import { MetricsCollector } from './metrics.js';
import type { LLMProvider, GenerateOptions, GenerateResult } from './types.js';

const metrics = new MetricsCollector();

export async function generate<T extends z.ZodTypeAny>(
  provider: LLMProvider,
  options: GenerateOptions<T>,
  maxRetries: number = 3
): Promise<GenerateResult<z.infer<T>>> {
  const jsonSchema = z.toJSONSchema(options.schema);
  const startTime = Date.now();
  let attempts = 0;
  let lastError = '';

  while (attempts < maxRetries) {
    attempts++;

    const prompt = attempts === 1
      ? buildPrompt(options.prompt, jsonSchema)
      : buildRetryPrompt(options.prompt, jsonSchema, lastError);

    try {
      const raw = await provider.call(prompt);
      const repaired = repairJson(raw);
      const parsed = JSON.parse(repaired);
      const validated = options.schema.parse(parsed);

      metrics.record({ attempts, success: true, latencyMs: Date.now() - startTime });
      return { data: validated, attempts, success: true };

    } catch (err) {
      lastError = err instanceof Error ? err.message : String(err);
    }
  }

  metrics.record({ attempts, success: false, latencyMs: Date.now() - startTime });
  throw new Error(`Failed after ${attempts} attempts. Last error: ${lastError}`);
}

function buildPrompt(userPrompt: string, schema: unknown): string {
  return `${userPrompt}

Respond with a JSON object that matches this schema exactly:
${JSON.stringify(schema, null, 2)}

Return only valid JSON. No markdown, no explanation.`;
}

function buildRetryPrompt(userPrompt: string, schema: unknown, error: string): string {
  return `${userPrompt}

Your previous response failed validation with this error:
${error}

Respond with a JSON object that matches this schema exactly:
${JSON.stringify(schema, null, 2)}

Return only valid JSON. No markdown, no explanation.`;
}

export { metrics };