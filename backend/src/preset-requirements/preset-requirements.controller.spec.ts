import { Test, TestingModule } from '@nestjs/testing'
import { PresetRequirementsController } from './preset-requirements.controller'
import { PresetRequirementsService } from './preset-requirements.service'

describe('PresetRequirementsController', () => {
  let controller: PresetRequirementsController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PresetRequirementsController],
      providers: [PresetRequirementsService],
    }).compile()

    controller = module.get<PresetRequirementsController>(PresetRequirementsController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
