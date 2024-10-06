import { Module, forwardRef } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { PresetRule } from './entities/preset-rule.entity'
import { PresetRequirement } from '../preset-requirements/entities/preset-requirement.entity'
import { PresetRulesService } from './preset-rules.service'
import { PresetRulesController } from './preset-rules.controller'
import { PresetCoursesModule } from '../preset-courses/preset-courses.module'

@Module({
  imports: [
    TypeOrmModule.forFeature([PresetRule, PresetRequirement]),
    forwardRef(() => PresetCoursesModule), // 使用 forwardRef 来处理循环依赖
  ],
  providers: [PresetRulesService],
  controllers: [PresetRulesController],
  exports: [TypeOrmModule, PresetRulesService],
})
export class PresetRulesModule {}
