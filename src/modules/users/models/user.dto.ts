import { IsOptional, IsString } from 'class-validator';

export type UserDto = {
  id: string;
  displayName: string;
  userPrincipalName: string;
  mail?: string;
  jobTitle?: string;
};

export class UserFilter {
  @IsOptional()
  @IsString()
  displayName: string;

  @IsOptional()
  @IsString()
  mail: string;
}
