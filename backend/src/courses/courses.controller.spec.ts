import { Test, TestingModule } from '@nestjs/testing'
import { CoursesController } from './courses.controller'
import { CoursesService } from './courses.service'

describe('CoursesController', () => {
  let controller: CoursesController
  let coursesService: CoursesService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CoursesController],
      providers: [
        {
          provide: CoursesService,
          useValue: {
            findAll: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
            findVersions: jest.fn(),
            createVersion: jest.fn(),
            findFullCourse: jest.fn(),
          },
        },
      ],
    }).compile()

    controller = module.get<CoursesController>(CoursesController)
    coursesService = module.get<CoursesService>(CoursesService)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })

  describe('findAll', () => {
    it('should return an array of courses', async () => {
      const result = ['test']
      jest.spyOn(coursesService, 'findAll').mockImplementation(() => Promise.resolve(result as any))
      expect(await controller.findAll()).toBe(result)
    })
  })

  // Add more tests for other methods...
})
