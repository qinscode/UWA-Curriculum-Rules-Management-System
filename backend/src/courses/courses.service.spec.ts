import { Test, TestingModule } from '@nestjs/testing'
import { CoursesService } from './courses.service'
import { getRepositoryToken } from '@nestjs/typeorm'
import { Course } from './entities/course.entity'
import { NotFoundException } from '@nestjs/common'
import { Repository } from 'typeorm'
import { CreateCourseDto } from './dto'

describe('CoursesService', () => {
  let service: CoursesService
  let courseRepository: Repository<Course>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CoursesService,
        {
          provide: getRepositoryToken(Course),
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile()

    service = module.get<CoursesService>(CoursesService)
    courseRepository = module.get<Repository<Course>>(getRepositoryToken(Course))
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('findAll', () => {
    it('should return an array of courses', async () => {
      const expectedCourses: Partial<Course>[] = [
        {
          id: 1,
          name: 'Course 1',
          code: 'C1',
          description: 'Description 1',
          version: 1,
          is_current: true,
        },
        {
          id: 2,
          name: 'Course 2',
          code: 'C2',
          description: 'Description 2',
          version: 1,
          is_current: true,
        },
      ]
      jest.spyOn(courseRepository, 'find').mockResolvedValue(expectedCourses as Course[])

      const result = await service.findAll()
      expect(result).toEqual(expectedCourses)
    })
  })

  describe('findOne', () => {
    it('should return a course if it exists', async () => {
      const expectedCourse: Partial<Course> = {
        id: 1,
        name: 'Course 1',
        code: 'C1',
        description: 'Description 1',
        version: 1,
        is_current: true,
      }
      jest.spyOn(courseRepository, 'findOne').mockResolvedValue(expectedCourse as Course)

      const result = await service.findOne(1)
      expect(result).toEqual(expectedCourse)
    })
  })

  describe('create', () => {
    it('should successfully create a course', async () => {
      const courseDto: CreateCourseDto = {
        name: 'New Course',
        code: 'NC101',
        description: 'A new course',
        version: 1,
        is_current: true,
      }
      const expectedCourse: Partial<Course> = { id: 1, ...courseDto }

      jest.spyOn(courseRepository, 'create').mockReturnValue(courseDto as Course)
      jest.spyOn(courseRepository, 'save').mockResolvedValue(expectedCourse as Course)

      const result = await service.create(courseDto)
      expect(result).toEqual(expectedCourse)
    })
  })

  describe('update', () => {
    it('should successfully update a course', async () => {
      const courseId = 1
      const updateDto = { name: 'Updated Course' }
      const existingCourse = { id: courseId, name: 'Old Course', code: 'OC101' }
      const updatedCourse = { ...existingCourse, ...updateDto }

      jest.spyOn(courseRepository, 'findOne').mockResolvedValue(existingCourse as Course)
      jest.spyOn(courseRepository, 'save').mockResolvedValue(updatedCourse as Course)

      const result = await service.update(courseId, updateDto)
      expect(result).toEqual(updatedCourse)
    })

    it('should throw NotFoundException if course to update does not exist', async () => {
      jest.spyOn(courseRepository, 'findOne').mockResolvedValue(null)

      await expect(service.update(1, { name: 'Updated Course' })).rejects.toThrow(NotFoundException)
    })
  })
})
