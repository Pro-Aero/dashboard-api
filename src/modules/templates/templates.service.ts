import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import { TaskTemplateMapper } from './mappers/task-template.mapper';
import { TemplateMapper } from './mappers/templates.mapper';
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

  async findAll(): Promise<TemplateDTO[]> {
    const templates = await this.templateRepository.findAll();

    return templates.map(TemplateMapper.entityToDTO);
  }

  async findById(templateId: string): Promise<TemplateDTO> {
    const template = await this.templateRepository.findById(templateId);

    if (!template) {
      throw Error();
    }

    return TemplateMapper.entityToDTO(template);
  }
}
