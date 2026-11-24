import type { AiAnswer } from './ai-answer.schema.js';

export interface AiPrompt {
  system: string;
  player: string;
}


export abstract class AiProvider {
  abstract playTurn(prompt: AiPrompt): Promise<AiAnswer>;
}
