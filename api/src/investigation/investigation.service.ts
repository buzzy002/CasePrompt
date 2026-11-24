import { Injectable } from '@nestjs/common';
import type {
    TurnRequestDto,
    TurnResponseDto,
} from './investigation.schemas.js';

// @Injectable() permet à Nest de créer ce service et de l'injecter dans le contrôleur.
@Injectable()
export class InvestigationService {
    playTurn(request: TurnRequestDto): TurnResponseDto {
        return {
            narration:
                "Tu observes la pièce en silence. La pluie bat contre la vitre, et rien ne semble avoir bougé.",
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