import { Test, TestingModule } from '@nestjs/testing';
import { RequirementsService } from './requirements.service';

describe('RequirementsService', () => {
  let service: RequirementsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RequirementsService],
    }).compile();

    service = module.get<RequirementsService>(RequirementsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
