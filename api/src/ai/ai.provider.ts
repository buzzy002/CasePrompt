import type { AiAnswer } from './ai-answer.schema.js';

export interface AiPrompt {
  system: string;
  player: string;
}

// An abstract class rather than an interface: Nest needs a runtime value as injection token.
export abstract class AiProvider {
  abstract playTurn(prompt: AiPrompt): Promise<AiAnswer>;
}
