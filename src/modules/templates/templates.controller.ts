import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { CreateTemplateDTO, TemplateDTO } from './models/templates.dto';
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
}
