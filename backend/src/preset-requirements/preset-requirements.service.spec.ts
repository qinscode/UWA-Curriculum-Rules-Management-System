import { Test, TestingModule } from '@nestjs/testing'
import { PresetRequirementsService } from './preset-requirements.service'

describe('PresetRequirementsService', () => {
  let service: PresetRequirementsService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PresetRequirementsService],
    }).compile()

    service = module.get<PresetRequirementsService>(PresetRequirementsService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
