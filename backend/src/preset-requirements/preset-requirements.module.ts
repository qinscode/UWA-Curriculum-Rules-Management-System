import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { PresetRequirementsService } from './preset-requirements.service'
import { PresetRequirementsController } from './preset-requirements.controller'
import { PresetRule } from '../preset-rules/entities/preset-rule.entity'

@Module({
  imports: [TypeOrmModule.forFeature([PresetRequirement, PresetRule])],
  providers: [PresetRequirementsService],
  controllers: [PresetRequirementsController],
  exports: [PresetRequirementsService],
})
export class PresetRequirementsModule {}
