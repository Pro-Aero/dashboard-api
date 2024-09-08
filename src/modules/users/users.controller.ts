import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Query,
} from '@nestjs/common';
import { UserFilter } from './models/user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(@Query() filter: UserFilter) {
    return await this.usersService.findAll(filter);
  }

  @Get(':userId')
  @HttpCode(HttpStatus.OK)
  async findById(@Param('userId') userId: string) {
    return await this.usersService.findById(userId);
  }
}
