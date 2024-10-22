import { Injectable } from '@nestjs/common';
import { prisma } from 'src/config/prisma-client';
import { TaskTemplateMapper } from '../mappers/task-template.mapper';
import { TemplateMapper } from '../mappers/templates.mapper';
import { TaskTemplateEntity, TemplateEntity } from '../models/templates.entity';

@Injectable()
export class TemplateRepository {
  async create(entity: TemplateEntity): Promise<TemplateEntity> {
    const template = TemplateMapper.entityToModel(entity);
    const tasks = entity.tasks.map(TaskTemplateMapper.entityToCreateModel);

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

  async createTasks(entities: TaskTemplateEntity[]): Promise<void> {
    const tasks = entities.map(TaskTemplateMapper.entityToModel);

    for (const task of tasks) {
      await prisma.taskTemplate.create({
        data: task,
      });
    }
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

  async update(
    templateId: string,
    template: Partial<TemplateEntity>,
  ): Promise<TemplateEntity> {
    const taskUpdate = await prisma.template.update({
      where: {
        id: templateId,
      },
      data: {
        title: template.title,
      },
      include: { tasks: true },
    });

    return TemplateMapper.modelToEntity(taskUpdate);
  }

  async remove(templateId: string): Promise<void> {
    await prisma.taskTemplate.deleteMany({
      where: { templateId },
    });

    await prisma.template.delete({
      where: { id: templateId },
    });
  }

  async removeAllTasks(templateId: string): Promise<void> {
    await prisma.taskTemplate.deleteMany({
      where: { templateId },
    });
  }
}
