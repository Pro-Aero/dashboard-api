import { Module } from '@nestjs/common';
import { SyncModule } from '../sync/sync.module';
import { TemplateRepository } from './repositories/template.repository';
import { TemplatesController } from './templates.controller';
import { TemplatesService } from './templates.service';

@Module({
  imports: [SyncModule],
  controllers: [TemplatesController],
  providers: [TemplatesService, TemplateRepository],
})
export class TemplatesModule {}
