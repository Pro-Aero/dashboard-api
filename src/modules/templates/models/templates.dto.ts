import { Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
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

export type TemplateDTO = {
  id: string;
  title: string;
  tasks: TaskTemplateDTO[];
};

export type TaskTemplateDTO = {
  title: string;
  priority: number;
  hours: number;
};
