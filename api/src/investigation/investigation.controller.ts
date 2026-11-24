import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { Public } from '@nestjs/authentication';
import { InvestigationService } from './investigation.service.js';
import {
    turnRequestSchema,
    type TurnRequestDto,
} from './investigation.schemas.js';

@Controller('investigation')
export class InvestigationController {
    constructor(private readonly investigation: InvestigationService) { }

    // TODO M0: replace @Public() with @Can.Anyone() once the front sends the JWT.
    @Public()
    @Post('turn')
    @HttpCode(200)
    turn(@Body({ schema: turnRequestSchema }) body: TurnRequestDto) {
        return this.investigation.playTurn(body);
    }
}