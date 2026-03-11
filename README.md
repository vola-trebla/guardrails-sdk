# guardrails-sdk

npm-библиотека для гарантированно валидного типизированного вывода из LLM.

Вместо голого вызова LLM — пишешь `generate(schema, prompt)` и получаешь типизированный объект, который точно прошёл валидацию.

## Как работает

1. Передаёшь **Zod-схему** + промпт
2. SDK вызывает LLM, парсит ответ, прогоняет через Zod
3. Не прошло? **Local repair** — чинит JSON без LLM (trailing comma, незакрытые скобки, markdown fences)
4. Не помогло? **Self-correction** — отправляет LLM свою же ошибку: "вот твой JSON, вот ошибка — исправь"
5. Ведёт **метрики**: % успешных с первого раза, среднее число ретраев, latency

## Пример

```typescript
import { createGuardrails } from 'guardrails-sdk';
import { z } from 'zod';

const guard = createGuardrails({ provider: 'gemini', maxRetries: 3 });

const result = await guard.generate({
  schema: z.object({
    title: z.string(),
    score: z.number().min(1).max(10),
    tags: z.array(z.string()).max(3),
  }),
  prompt: 'Rate this article about Bitcoin ETFs',
});

// result: { title: string, score: number, tags: string[] } — гарантированно
```

## Core модули

| Модуль | Что делает |
|---|---|
| `generate()` | Главная функция: schema + prompt → typed object |
| Local repair | JSON fix без LLM (strip fences, fix commas, close brackets) |
| Self-correction | Retry с ошибкой валидации в промпте |
| Metrics collector | Success rate, retry count, avg latency per call |
| Multi-provider | Gemini + OpenAI через единый интерфейс |

## Стек

TypeScript, Zod, Gemini API, OpenAI API (optional)

## Установка

```bash
npm install guardrails-sdk
```

## Лицензия

MIT
