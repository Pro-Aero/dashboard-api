import { Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsNotEmptyObject,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export class CreateTemplateDTO {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateTaskTemplateDTO)
  tasks: CreateTaskTemplateDTO[];
}

export class CreateTaskTemplateDTO {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsNumber()
  priority: number;

  @IsNotEmpty()
  @IsNumber()
  hours: number;
}

export class UpdateTemplateDTO {
  @IsOptional()
  @IsString()
  title: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateTaskTemplateDTO)
  tasks: CreateTaskTemplateDTO[];
}

export class ExecuteTemplateDTO {
  @IsNotEmpty()
  @IsObject()
  @IsNotEmptyObject()
  assignments: Record<string, string>;
}

export type TemplateDTO = {
  id: string;
  title: string;
  tasks: TaskTemplateDTO[];
};

export type TaskTemplateDTO = {
  id: string;
  title: string;
  priority: number;
  hours: number;
};
