import { createGuardrails } from '../src/index.js';
import { z } from 'zod';
import 'dotenv/config';

const guard = createGuardrails({
  provider: 'gemini',
  maxRetries: 3,
});

const result = await guard.generate({
  schema: z.object({
    title: z.string(),
    score: z.number().min(1).max(10),
    tags: z.array(z.string()).max(3),
  }),
  prompt: 'Rate this article about Bitcoin ETFs',
});

console.log('Result:', result.data);
console.log('Attempts:', result.attempts);
console.log('Metrics:', guard.metrics());