import { IsOptional, IsString } from 'class-validator';

export type GroupDto = {
  id: string;
  displayName: string;
  description?: string;
  mail?: string;
};

export class GroupFilter {
  @IsOptional()
  @IsString()
  displayName: string;

  @IsOptional()
  @IsString()
  mail: string;
}
