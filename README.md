# guardrails-sdk

An npm library for guaranteed valid, typed output from LLMs.

Instead of raw LLM calls — just write `generate(schema, prompt)` and get a typed object that is guaranteed to pass validation.

## How it works

1. Pass a **Zod schema** + prompt
2. SDK calls the LLM, parses the response, validates it through Zod
3. Failed? **Local repair** — fixes JSON without an LLM call (trailing commas, unclosed brackets, markdown fences)
4. Still broken? **Self-correction** — sends the LLM its own error: "here's your JSON, here's the error — fix it"
5. Tracks **metrics**: first-attempt success rate, average retries, latency

## Example

```typescript
import { createGuardrails } from 'guardrails-sdk';
import * as z from 'zod';

const guard = createGuardrails({ provider: 'gemini', maxRetries: 3 });

const result = await guard.generate({
  schema: z.object({
    title: z.string(),
    score: z.number().min(1).max(10),
    tags: z.array(z.string()).max(3),
  }),
  prompt: 'Rate this article about Bitcoin ETFs',
});

// result: { title: string, score: number, tags: string[] } — guaranteed
```

## Core modules

| Module | Description |
|---|---|
| `generate()` | Main function: schema + prompt → typed object |
| Local repair | JSON fix without LLM (strip fences, fix commas, close brackets) |
| Self-correction | Retry with validation error in prompt |
| Metrics collector | Success rate, retry count, avg latency per call |
| Multi-provider | Gemini + Anthropic via a unified interface |

## Stack

TypeScript, Zod, Gemini API, Anthropic API

## Installation

```bash
npm install guardrails-sdk
```

## License

MIT
