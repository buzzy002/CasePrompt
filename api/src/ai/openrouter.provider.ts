import { z } from 'zod';
import { AiProvider, type AiPrompt } from './ai.provider.js';
import { aiAnswerSchema, type AiAnswer } from './ai-answer.schema.js';

const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';
const AI_ANSWER_JSON_SCHEMA = z.toJSONSchema(aiAnswerSchema);

export interface OpenRouterConfig {
  apiKey: string;
  model: string;
  timeoutMs: number;
}

const openRouterResponseSchema = z.object({
  choices: z
    .array(z.object({ message: z.object({ content: z.string() }) }))
    .min(1),
});

export class OpenRouterProvider extends AiProvider {
  constructor(private readonly config: OpenRouterConfig) {
    super();
  }

  async playTurn(prompt: AiPrompt): Promise<AiAnswer> {
    const response = await fetch(OPENROUTER_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.config.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: this.config.model,
        messages: [
          { role: 'system', content: prompt.system },
          { role: 'user', content: prompt.player },
        ],
        response_format: {
          type: 'json_schema',
          json_schema: {
            name: 'turn',
            strict: true,
            schema: AI_ANSWER_JSON_SCHEMA,
          },
        },
        provider: {
          require_parameters: true,
          // Excludes providers that keep prompts.
          data_collection: 'deny',
        },
      }),
      signal: AbortSignal.timeout(this.config.timeoutMs),
    });

    // TODO step 7: one error per failure, turned into a message for the player.
    if (!response.ok) {
      throw new Error(
        `OpenRouter a répondu ${response.status} : ${await response.text()}`,
      );
    }

    const parsedResponse = openRouterResponseSchema.safeParse(
      await response.json(),
    );
    if (!parsedResponse.success) {
      throw new Error('Réponse d’OpenRouter dans un format inattendu');
    }
    const content = parsedResponse.data.choices[0].message.content;

    const answer = aiAnswerSchema.safeParse(parseJson(content));
    if (!answer.success) {
      throw new Error(`Réponse du modèle inutilisable : ${content}`);
    }
    return answer.data;
  }
}

/** Tolerates a ```json fence around the answer; undefined when it is not JSON. */
function parseJson(content: string): unknown {
  const withoutFence = content
    .trim()
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```$/, '');
  try {
    return JSON.parse(withoutFence);
  } catch {
    return undefined;
  }
}
