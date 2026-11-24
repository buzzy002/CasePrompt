import { Injectable } from '@nestjs/common';
import { AiProvider } from './ai.provider.js';
import type { AiAnswer } from './ai-answer.schema.js';

@Injectable()
export class FakeProvider extends AiProvider {
  playTurn(): Promise<AiAnswer> {
    return Promise.resolve({
      action: null,
      new_condition: null,
      removed_condition: null,
      narration:
        'Tu observes la pièce en silence. La pluie bat contre la vitre, et rien ne semble avoir bougé.',
    });
  }
}
