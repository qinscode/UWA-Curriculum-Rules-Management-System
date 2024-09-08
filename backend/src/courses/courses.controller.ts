import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards } from '@nestjs/common'
import { CoursesService } from './courses.service'
import { Course } from './entities/course.entity'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { CreateCourseDto, UpdateCourseDto } from './dto'

@Controller('courses')
@UseGuards(JwtAuthGuard)
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  // 获取所有课程，返回时带有 versions 字段
  @Get()
  findAll(): Promise<any[]> {
    return this.coursesService.findAll()
  }

  // 根据课程 ID 获取课程信息，并返回带有 versions 字段的课程
  @Get(':id')
  findOne(@Param('id') id: string): Promise<any> {
    return this.coursesService.findOne(+id)
  }

  // 创建课程
  @Post()
  create(@Body() createCourseDto: CreateCourseDto): Promise<Course> {
    return this.coursesService.create(createCourseDto)
  }

  // 更新课程信息
  @Put(':id')
  update(@Param('id') id: string, @Body() updateCourseDto: UpdateCourseDto): Promise<Course> {
    return this.coursesService.update(+id, updateCourseDto)
  }

  // 删除课程
  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.coursesService.remove(+id)
  }
}
