import { Module, forwardRef } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { PresetRulesService } from './preset-rules.service'

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
