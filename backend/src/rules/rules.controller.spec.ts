import { Test, TestingModule } from '@nestjs/testing'
import { RulesController } from './rules.controller'
import { RulesService } from './rules.service'
import { CreateRuleDto, UpdateRuleDto } from './dto/rule.dto'
import { Rule } from './entities/rule.entity'
import { Course } from '../courses/entities/course.entity'
import { Requirement } from '../requirements/entities/requirement.entity'

describe('RulesController', () => {
  let controller: RulesController
  let service: RulesService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RulesController],
      providers: [
        {
          provide: RulesService,
          useValue: {
            findAll: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile()

    controller = module.get<RulesController>(RulesController)
    service = module.get<RulesService>(RulesService)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })

  const mockRequirement: Requirement = {
    id: 1,
    content: 'Test requirement',
    style: 'numeric',
    parent_id: null,
    is_connector: false,
    order_index: 1,
    rule: null, // This will be set when the rule is created
    created_at: new Date(),
    updated_at: new Date(),
  }

  describe('findAll', () => {
    it('should return an array of rules', async () => {
      const result: Rule[] = [
        {
          id: 1,
          name: 'Rule 1',
          code: 'R1',
          type: 'Type1',
          description: 'Description 1',
          course: { id: 1 } as Course,
          requirements: [mockRequirement],
          created_at: new Date(),
          updated_at: new Date(),
        },
      ]
      jest.spyOn(service, 'findAll').mockResolvedValue(result)
      expect(await controller.findAll('1')).toBe(result)
      expect(service.findAll).toHaveBeenCalledWith(1)
    })
  })

  describe('findOne', () => {
    it('should return a single rule', async () => {
      const result: Rule = {
        id: 1,
        name: 'Rule 1',
        code: 'R1',
        type: 'Type1',
        description: 'Description 1',
        course: { id: 1 } as Course,
        requirements: [mockRequirement],
        created_at: new Date(),
        updated_at: new Date(),
      }
      jest.spyOn(service, 'findOne').mockResolvedValue(result)
      expect(await controller.findOne('1', '1')).toBe(result)
      expect(service.findOne).toHaveBeenCalledWith(1, 1)
    })
  })

  describe('create', () => {
    it('should create a new rule', async () => {
      const createDto: CreateRuleDto = {
        name: 'New Rule',
        code: 'NR101',
        type: 'Type',
        description: 'A new rule',
        requirements: [
          {
            content: 'Test requirement',
            style: 'numeric',
            parent_id: null,
            is_connector: false,
            order_index: 1,
          },
        ],
      }
      const result: Rule = {
        id: 1,
        name: createDto.name,
        code: createDto.code,
        type: createDto.type,
        description: createDto.description,
        course: { id: 1 } as Course,
        requirements: [mockRequirement],
        created_at: new Date(),
        updated_at: new Date(),
      }
      jest.spyOn(service, 'create').mockResolvedValue(result)
      expect(await controller.create('1', createDto)).toBe(result)
      expect(service.create).toHaveBeenCalledWith(1, createDto)
    })
  })

  describe('update', () => {
    it('should update a rule', async () => {
      const updateDto: UpdateRuleDto = { name: 'Updated Rule' }
      const result: Rule = {
        id: 1,
        name: 'Updated Rule',
        code: 'UR101',
        type: 'Type',
        description: 'An updated rule',
        course: { id: 1 } as Course,
        requirements: [mockRequirement],
        created_at: new Date(),
        updated_at: new Date(),
      }
      jest.spyOn(service, 'update').mockResolvedValue(result)
      expect(await controller.update('1', '1', updateDto)).toBe(result)
      expect(service.update).toHaveBeenCalledWith(1, 1, updateDto)
    })
  })

  describe('remove', () => {
    it('should remove a rule', async () => {
      jest.spyOn(service, 'remove').mockResolvedValue(undefined)
      await controller.remove('1', '1')
      expect(service.remove).toHaveBeenCalledWith(1, 1)
    })
  })
})
