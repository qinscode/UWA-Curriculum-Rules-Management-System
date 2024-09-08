import { Test, TestingModule } from '@nestjs/testing'
import { DocumentsController } from './documents.controller'
import { DocumentsService } from './documents.service'

describe('DocumentsController', () => {
  let controller: DocumentsController
  let service: DocumentsService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DocumentsController],
      providers: [
        {
          provide: DocumentsService,
          useValue: {
            generateCoursePDF: jest.fn(),
            generateCourseHTML: jest.fn(),
          },
        },
      ],
    }).compile()

    controller = module.get<DocumentsController>(DocumentsController)
    service = module.get<DocumentsService>(DocumentsService)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })

  describe('generateCoursePDF', () => {
    it('should call services.generateCoursePDF with correct id', async () => {
      const courseId = '1'
      const expectedResult = { url: 'http://example.com/pdf/course_1_rules.pdf' }
      jest.spyOn(service, 'generateCoursePDF').mockResolvedValue(expectedResult)

      const result = await controller.generateCoursePDF(courseId)

      expect(service.generateCoursePDF).toHaveBeenCalledWith(courseId)
      expect(result).toEqual(expectedResult)
    })
  })

  describe('generateCourseHTML', () => {
    it('should call services.generateCourseHTML with correct id', async () => {
      const courseId = '1'
      const expectedResult = { url: 'http://example.com/html/course_1_rules.html' }
      jest.spyOn(service, 'generateCourseHTML').mockResolvedValue(expectedResult)

      const result = await controller.generateCourseHTML(courseId)

      expect(service.generateCourseHTML).toHaveBeenCalledWith(courseId)
      expect(result).toEqual(expectedResult)
    })
  })
})
