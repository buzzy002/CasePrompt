import { Test, TestingModule } from '@nestjs/testing';
import { AiModule } from '../ai/ai.module.js';
import { InvestigationController } from './investigation.controller.js';
import { InvestigationService } from '../investigation/investigation.service.js';

describe('InvestigationController', () => {
  let controller: InvestigationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AiModule],
      controllers: [InvestigationController],
      providers: [InvestigationService],
    }).compile();

    controller = module.get<InvestigationController>(InvestigationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('answers a turn and uses one action', async () => {
    const response = await controller.turn({
      text: "J'ouvre le tiroir",
      state: {
        phase: 'investigation',
        done: [],
        items: [],
        conditions: [],
        actionsLeft: 20,
      },
      history: [],
    });

    expect(response.narration).not.toBe('');
    expect(response.action).toBeNull();
    expect(response.state.actionsLeft).toBe(19);
  });
});
