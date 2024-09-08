import { Test, TestingModule } from '@nestjs/testing';
import { RequirementsController } from './requirements.controller';
import { RequirementsService } from './requirements.service';

describe('RequirementsController', () => {
  let controller: RequirementsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RequirementsController],
      providers: [RequirementsService],
    }).compile();

    controller = module.get<RequirementsController>(RequirementsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
