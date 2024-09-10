import { Module } from '@nestjs/common';
import { PresetService } from './preset.service';
import { PresetController } from './preset.controller';

@Module({
  controllers: [PresetController],
  providers: [PresetService],
})
export class PresetModule {}
