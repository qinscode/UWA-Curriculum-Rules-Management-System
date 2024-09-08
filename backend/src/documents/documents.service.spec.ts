import { Test, TestingModule } from '@nestjs/testing'
import { DocumentsService } from './documents.service'
import { getRepositoryToken } from '@nestjs/typeorm'
import { Course } from '../courses/entities/course.entity'
import { Rule } from '../rules/entities/rule.entity'
import { NotFoundException } from '@nestjs/common'

describe('DocumentsService', () => {
  let service: DocumentsService
  let mockCourseRepository
  let mockRuleRepository

  beforeEach(async () => {
    process.env.PDF_URL_PREFIX = 'http://example.com/pdf'
    process.env.HTML_URL_PREFIX = 'http://example.com/html'

    mockCourseRepository = {
      findOne: jest.fn(),
    }
    mockRuleRepository = {}

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DocumentsService,
        {
          provide: getRepositoryToken(Course),
          useValue: mockCourseRepository,
        },
        {
          provide: getRepositoryToken(Rule),
          useValue: mockRuleRepository,
        },
      ],
    }).compile()

    service = module.get<DocumentsService>(DocumentsService)
  })

  afterEach(() => {
    delete process.env.PDF_URL_PREFIX
    delete process.env.HTML_URL_PREFIX
  })
  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('generateCoursePDF', () => {
    it('should generate PDF and return URL', async () => {
      const courseId = '1'
      const mockCourse = {
        id: 1,
        rules: [
          {
            name: 'Test Rule',
            requirements: [{ order_index: 1, content: 'Test Requirement' }],
          },
        ],
      }

      mockCourseRepository.findOne.mockResolvedValue(mockCourse)

      const result = await service.generateCoursePDF(courseId)

      expect(result).toHaveProperty('url')
      expect(result.url).toContain('course_1_rules.pdf')
    })

    it('should throw NotFoundException if course not found', async () => {
      const courseId = '999'
      mockCourseRepository.findOne.mockResolvedValue(null)

      await expect(service.generateCoursePDF(courseId)).rejects.toThrow(NotFoundException)
    })
  })

  describe('generateCourseHTML', () => {
    it('should generate HTML and return URL', async () => {
      const courseId = '1'
      const mockCourse = {
        id: 1,
        rules: [
          {
            name: 'Test Rule',
            requirements: [{ order_index: 1, content: 'Test Requirement' }],
          },
        ],
      }

      mockCourseRepository.findOne.mockResolvedValue(mockCourse)

      const result = await service.generateCourseHTML(courseId)

      expect(result).toHaveProperty('url')
      expect(result.url).toContain('course_1_rules.html')
    })

    it('should throw NotFoundException if course not found', async () => {
      const courseId = '999'
      mockCourseRepository.findOne.mockResolvedValue(null)

      await expect(service.generateCourseHTML(courseId)).rejects.toThrow(NotFoundException)
    })
  })
})
