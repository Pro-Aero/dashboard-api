import { Injectable } from '@nestjs/common';
import { prisma } from 'src/config/prisma-client';
import { TaskTemplateMapper } from '../mappers/task-template.mapper';
import { TemplateMapper } from '../mappers/templates.mapper';
import { TemplateEntity } from '../models/templates.entity';

@Injectable()
export class TemplateRepository {
  async create(entity: TemplateEntity): Promise<TemplateEntity> {
    const template = TemplateMapper.entityToModel(entity);
    const tasks = entity.tasks.map(TaskTemplateMapper.entityToModel);

    const taskCreated = await prisma.template.create({
      data: {
        ...template,
        tasks: {
          create: tasks,
        },
      },
      include: { tasks: true },
    });

    return TemplateMapper.modelToEntity(taskCreated);
  }

  async findAll(): Promise<TemplateEntity[]> {
    const templates = await prisma.template.findMany({
      include: { tasks: true },
    });
    return templates.map(TemplateMapper.modelToEntity);
  }

  async findById(templateId: string): Promise<TemplateEntity> {
    const template = await prisma.template.findUnique({
      where: { id: templateId },
      include: { tasks: true },
    });

    if (!template) null;

    return TemplateMapper.modelToEntity(template);
  }
}
