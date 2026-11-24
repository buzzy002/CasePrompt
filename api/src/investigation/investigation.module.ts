import { Module } from '@nestjs/common';
import { InvestigationController } from './investigation.controller.js';

@Module({
  controllers: [InvestigationController]
})
export class InvestigationModule {}
