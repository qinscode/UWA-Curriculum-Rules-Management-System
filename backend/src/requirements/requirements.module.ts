import { Module } from '@nestjs/common';
import { RequirementsService } from './requirements.service';
import { RequirementsController } from './requirements.controller';

@Module({
  controllers: [RequirementsController],
  providers: [RequirementsService],
})
export class RequirementsModule {}
