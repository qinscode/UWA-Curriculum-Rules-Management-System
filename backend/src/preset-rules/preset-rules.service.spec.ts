import { Test, TestingModule } from '@nestjs/testing'
import { PresetRulesService } from './preset-rules.service'

describe('PresetRulesService', () => {
  let service: PresetRulesService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PresetRulesService],
    }).compile()

    service = module.get<PresetRulesService>(PresetRulesService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
