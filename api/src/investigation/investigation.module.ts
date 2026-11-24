import { Module } from '@nestjs/common';
import { AiModule } from '../ai/ai.module.js';
import { InvestigationController } from './investigation.controller.js';
import { InvestigationService } from './investigation.service.js';

@Module({
  imports: [AiModule],
  controllers: [InvestigationController],
  providers: [InvestigationService],
})
export class InvestigationModule {}
