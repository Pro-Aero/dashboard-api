import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import {
  CreateTemplateDTO,
  TemplateDTO,
  UpdateTemplateDTO,
} from './models/templates.dto';
import { TemplatesService } from './templates.service';

@Controller('templates')
export class TemplatesController {
  constructor(private readonly templatesService: TemplatesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() body: CreateTemplateDTO): Promise<TemplateDTO> {
    return await this.templatesService.create(body);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(): Promise<TemplateDTO[]> {
    return await this.templatesService.findAll();
  }

  @Get(':templateId')
  @HttpCode(HttpStatus.OK)
  async findById(
    @Param('templateId') templateId: string,
  ): Promise<TemplateDTO> {
    return await this.templatesService.findById(templateId);
  }

  @Patch(':templateId')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('templateId') templateId: string,
    @Body() body: UpdateTemplateDTO,
  ): Promise<TemplateDTO> {
    return await this.templatesService.update(templateId, body);
  }

  @Delete(':templateId')
  @HttpCode(HttpStatus.OK)
  async remove(@Param('templateId') templateId: string): Promise<void> {
    return await this.templatesService.remove(templateId);
  }
}
