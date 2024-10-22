import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import { TaskTemplateMapper } from './mappers/task-template.mapper';
import { CreateTemplateDTO, TemplateDTO } from './models/templates.dto';
import { TemplateEntity } from './models/templates.entity';
import { TemplateRepository } from './repositories/template.repository';

@Injectable()
export class TemplatesService {
  constructor(private readonly templateRepository: TemplateRepository) {}

  async create(dto: CreateTemplateDTO): Promise<TemplateDTO> {
    const templateId = crypto.randomUUID();

    const entity: TemplateEntity = {
      id: templateId,
      title: dto.title,
      tasks: dto.tasks.map((task) =>
        TaskTemplateMapper.createDTOToEntity(
          task,
          crypto.randomUUID(),
          templateId,
        ),
      ),
    };

    const templateCreated = await this.templateRepository.create(entity);

    return templateCreated;
  }
}
