import { Prisma } from '@prisma/client';
import { TemplateDTO } from '../models/templates.dto';
import { TemplateEntity } from '../models/templates.entity';
import { TaskTemplateMapper } from './task-template.mapper';

export class TemplateMapper {
  static modelToEntity(
    raw: Prisma.TemplateGetPayload<{
      include: { tasks: true };
    }>,
  ): TemplateEntity {
    const entity: TemplateEntity = {
      id: raw.id,
      title: raw.title,
      tasks: raw.tasks.map(TaskTemplateMapper.modelToEntity),
    };

    return entity;
  }

  static entityToModel(entity: TemplateEntity): Prisma.TemplateCreateInput {
    const model: Prisma.TemplateCreateInput = {
      id: entity.id,
      title: entity.title,
    };

    return model;
  }

  static entityToDTO(entity: TemplateEntity): TemplateDTO {
    const dto: TemplateDTO = {
      id: entity.id,
      title: entity.title,
      tasks: entity.tasks.map(TaskTemplateMapper.entityToDTO),
    };

    return dto;
  }
}
