import { Test, TestingModule } from '@nestjs/testing';
import { RulesController } from './rules.controller';
import { RulesService } from './rules.service';

describe('RulesController', () => {
  let controller: RulesController;
  let service: RulesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RulesController],
      providers: [
        {
          provide: RulesService,
          useValue: {
            findAll: jest.fn().mockResolvedValue([
              { id: 1, code: 'CS101', name: 'Intro to CS', type: 'Standard' },
            ]),
          },
        },
      ],
    }).compile();

    controller = module.get<RulesController>(RulesController);
    service = module.get<RulesService>(RulesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return all rules', async () => {
    expect(await controller.findAll()).toEqual([
      { id: 1, code: 'CS101', name: 'Intro to CS', type: 'Standard' },
    ]);
    expect(service.findAll).toHaveBeenCalled();
  });

});