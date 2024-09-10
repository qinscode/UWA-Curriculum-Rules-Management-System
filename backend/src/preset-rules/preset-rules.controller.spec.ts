import { Test, TestingModule } from '@nestjs/testing'
import { PresetRulesController } from './preset-rules.controller'
import { PresetRulesService } from './preset-rules.service'

describe('PresetRulesController', () => {
  let controller: PresetRulesController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PresetRulesController],
      providers: [PresetRulesService],
    }).compile()

    controller = module.get<PresetRulesController>(PresetRulesController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
