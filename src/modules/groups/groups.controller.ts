import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Query,
} from '@nestjs/common';
import { GroupsService } from './groups.service';
import { GroupFilter } from './models/group.dto';

@Controller('groups')
export class GroupsController {
  constructor(private readonly groupsService: GroupsService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(@Query() filter: GroupFilter) {
    return await this.groupsService.findAll(filter);
  }

  @Get(':groupId')
  @HttpCode(HttpStatus.OK)
  async findById(@Param('groupId') groupId: string) {
    return await this.groupsService.findById(groupId);
  }
}
