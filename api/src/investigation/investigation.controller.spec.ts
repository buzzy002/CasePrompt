import { Test, TestingModule } from '@nestjs/testing';
import { InvestigationController } from './investigation.controller.js';

describe('InvestigationController', () => {
  let controller: InvestigationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InvestigationController],
    }).compile();

    controller = module.get<InvestigationController>(InvestigationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
