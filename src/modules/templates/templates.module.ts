import { Module } from '@nestjs/common';
import { TemplateRepository } from './repositories/template.repository';
import { TemplatesService } from './templates.service';
import { TemplatesController } from './templates.controller';

@Module({
  controllers: [TemplatesController],
  providers: [TemplatesService, TemplateRepository],
})
export class TemplatesModule {}
