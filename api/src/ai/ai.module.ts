import { Module } from '@nestjs/common';
import { AiProvider } from './ai.provider.js';
import { FakeProvider } from './fake.provider.js';
import { OpenRouterProvider } from './openrouter.provider.js';

@Module({
  providers: [
    {
      provide: AiProvider,
      useFactory: (): AiProvider => {
        const name = process.env.AI_PROVIDER ?? 'fake';
        switch (name) {
          case 'fake':
            return new FakeProvider();
          case 'openrouter':
            return createOpenRouterProvider();
          default:
            throw new Error(
              `AI_PROVIDER inconnu : "${name}". Valeurs possibles : fake, openrouter`,
            );
        }
      },
    },
  ],
  exports: [AiProvider],
})
export class AiModule {}

// Fails at startup rather than on a player's first turn.
function createOpenRouterProvider(): OpenRouterProvider {
  const apiKey = process.env.OPENROUTER_API_KEY;
  const model = process.env.OPENROUTER_MODEL;
  const timeoutMs = Number(process.env.AI_TIMEOUT_MS ?? 30_000);

  if (!apiKey) {
    throw new Error(
      'AI_PROVIDER=openrouter : OPENROUTER_API_KEY manque dans le .env',
    );
  }
  if (!model) {
    throw new Error(
      'AI_PROVIDER=openrouter : OPENROUTER_MODEL manque dans le .env',
    );
  }
  if (!Number.isInteger(timeoutMs) || timeoutMs <= 0) {
    throw new Error(
      'AI_TIMEOUT_MS doit être un nombre entier de millisecondes',
    );
  }
  return new OpenRouterProvider({ apiKey, model, timeoutMs });
}
