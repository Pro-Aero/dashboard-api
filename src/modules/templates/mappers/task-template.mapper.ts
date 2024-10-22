import { Prisma, TaskTemplate } from '@prisma/client';
import {
  CreateTaskTemplateDTO,
  TaskTemplateDTO,
} from '../models/templates.dto';
import { TaskTemplateEntity } from '../models/templates.entity';

export class TaskTemplateMapper {
  static modelToEntity(raw: TaskTemplate): TaskTemplateEntity {
    const entity: TaskTemplate = {
      id: raw.id,
      templateId: raw.id,
      title: raw.title,
      priority: raw.priority,
      hours: raw.hours,
    };

    return entity;
  }

  static entityToCreateModel(entity: TaskTemplateEntity) {
    const model = {
      id: entity.id,
      title: entity.title,
      priority: entity.priority,
      hours: entity.hours,
    };

    return model;
  }

  static entityToModel(
    entity: TaskTemplateEntity,
  ): Prisma.TaskTemplateCreateInput {
    const model: Prisma.TaskTemplateCreateInput = {
      id: entity.id,
      template: { connect: { id: entity.templateId } },
      title: entity.title,
      priority: entity.priority,
      hours: entity.hours,
    };

    return model;
  }

  static entityToDTO(entity: TaskTemplateEntity): TaskTemplateDTO {
    const dto: TaskTemplateDTO = {
      title: entity.title,
      priority: entity.priority,
      hours: entity.hours,
    };

    return dto;
  }

  static createDTOToEntity(
    dto: CreateTaskTemplateDTO,
    taskTemplateId: string,
    templateId: string,
  ): TaskTemplateEntity {
    const entity: TaskTemplateEntity = {
      id: taskTemplateId,
      templateId: templateId,
      title: dto.title,
      priority: dto.priority,
      hours: dto.hours,
    };

    return entity;
  }
}
