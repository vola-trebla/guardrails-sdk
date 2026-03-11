import { createGuardrails } from '../src/index.js';
import { z } from 'zod';
import 'dotenv/config';
import { repairJson } from '../src/repair.js';

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

// тест 1 — markdown fence
const test1 = repairJson('```json\n{"score": 8}\n```');
console.log('test1:', test1);

// тест 2 — trailing comma
const test2 = repairJson('{"score": 8, "tags": ["crypto",]}');
console.log('test2:', test2);

// тест 3 — оба сразу
const test3 = repairJson('```json\n{"score": 8,}\n```');
console.log('test3:', test3);