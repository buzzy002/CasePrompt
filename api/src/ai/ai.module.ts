import { Module } from '@nestjs/common';
import { AiProvider } from './ai.provider.js';
import { FakeProvider } from './fake.provider.js';

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
            throw new Error(
              'AI_PROVIDER=openrouter : pas encore implémenté (étape 5)',
            );
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
export class AiModule { }
