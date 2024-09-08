import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards } from '@nestjs/common'
import { CoursesService } from './courses.service'
import { Course } from './entities/course.entity'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { CreateCourseDto, UpdateCourseDto } from './dto'

@Controller('courses')
@UseGuards(JwtAuthGuard)
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Get()
  findAll(): Promise<Course[]> {
    return this.coursesService.findAll()
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Course> {
    return this.coursesService.findOne(+id)
  }

  @Post()
  create(@Body() createCourseDto: CreateCourseDto): Promise<Course> {
    return this.coursesService.create(createCourseDto)
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateCourseDto: UpdateCourseDto): Promise<Course> {
    return this.coursesService.update(+id, updateCourseDto)
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.coursesService.remove(+id)
  }

  @Get(':id/versions')
  findVersions(@Param('id') id: string): Promise<Course[]> {
    return this.coursesService.findVersions(+id)
  }

  @Post(':id/versions')
  createVersion(@Param('id') id: string): Promise<Course> {
    return this.coursesService.createVersion(+id)
  }

  @Get(':id/full')
  findFullCourse(@Param('id') id: string): Promise<Course> {
    return this.coursesService.findFullCourse(+id)
  }
}
