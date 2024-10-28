import { Injectable, NotFoundException } from '@nestjs/common';
import * as crypto from 'crypto';
import { TaskTemplateMapper } from './mappers/task-template.mapper';
import { TemplateMapper } from './mappers/templates.mapper';
import {
  CreateTemplateDTO,
  ExecuteTemplateDTO,
  TemplateDTO,
  UpdateTemplateDTO,
} from './models/templates.dto';
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

  async execute(
    templateId: string,
    plannerId: string,
    dto: ExecuteTemplateDTO,
  ): Promise<void> {
    const template = await this.templateRepository.findById(templateId);

    if (!template) {
      throw new NotFoundException();
    }

    await this.templateRepository.createTasks(
      template,
      plannerId,
      dto.assignments,
    );
  }

  async findAll(): Promise<TemplateDTO[]> {
    const templates = await this.templateRepository.findAll();

    return templates.map(TemplateMapper.entityToDTO);
  }

  async findById(templateId: string): Promise<TemplateDTO> {
    const template = await this.templateRepository.findById(templateId);

    if (!template) {
      throw new NotFoundException();
    }

    return TemplateMapper.entityToDTO(template);
  }

  async update(
    templateId: string,
    dto: UpdateTemplateDTO,
  ): Promise<TemplateDTO> {
    const template = await this.templateRepository.findById(templateId);

    if (!template) {
      throw new NotFoundException();
    }

    if (dto.tasks) {
      await this.templateRepository.removeAllTasks(template.id);

      const tasks = dto.tasks.map((task) =>
        TaskTemplateMapper.createDTOToEntity(
          task,
          crypto.randomUUID(),
          templateId,
        ),
      );

      await this.templateRepository.createTasksTemplate(tasks);
    }

    const templateUpdate = await this.templateRepository.update(template.id, {
      title: dto.title,
    });

    return TemplateMapper.entityToDTO(templateUpdate);
  }

  async remove(templateId: string): Promise<void> {
    const template = await this.templateRepository.findById(templateId);

    if (!template) {
      throw new NotFoundException();
    }

    await this.templateRepository.remove(template.id);
  }
}
