import { Test, TestingModule } from '@nestjs/testing';
import { PresetService } from './preset.service';

describe('PresetService', () => {
  let service: PresetService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PresetService],
    }).compile();

    service = module.get<PresetService>(PresetService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
