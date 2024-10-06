import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { PresetRulesController } from './preset-rules.controller'
import { PresetRulesService } from './preset-rules.service'
import { PresetRule } from './entities/preset-rule.entity'
import { PresetRequirement } from '../preset-requirements/entities/preset-requirement.entity'

@Module({
  imports: [TypeOrmModule.forFeature([PresetRule, PresetRequirement])],
  controllers: [PresetRulesController],
  providers: [PresetRulesService],
  exports: [PresetRulesService],
})
export class PresetRulesModule {}
