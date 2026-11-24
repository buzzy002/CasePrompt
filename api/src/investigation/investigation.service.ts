import { Injectable } from '@nestjs/common';
import { AiProvider } from '../ai/ai.provider.js';
import type {
  TurnRequestDto,
  TurnResponseDto,
} from './investigation.schemas.js';

@Injectable()
export class InvestigationService {
  constructor(private readonly ai: AiProvider) { }

  async playTurn(request: TurnRequestDto): Promise<TurnResponseDto> {
    const answer = await this.ai.playTurn({
      system: '',
      player: request.text,
    });
    return {
      narration: answer.narration,
      action: null,
      result: null,
      itemsGained: [],
      state: {
        ...request.state,
        actionsLeft: Math.max(request.state.actionsLeft - 1, 0),
      },
    };
  }
}
