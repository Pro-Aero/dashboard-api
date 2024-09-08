import { IsNotEmpty, IsString } from 'class-validator';

export class CreateAssignmentDto {
  @IsNotEmpty()
  @IsString()
  taskId: string;

  @IsNotEmpty()
  @IsString()
  userId: string;
}

export type AssignmentDto = {
  id: string;
  taskId: string;
  userId: string;
};
