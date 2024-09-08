import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Query,
} from '@nestjs/common';
import { PlannersService } from '../planners/planners.service';
import { GroupsService } from './groups.service';
import { GroupFilter } from './models/group.dto';
import { PlannerFilter } from '../planners/models/planner.dto';

@Controller('groups')
export class GroupsController {
  constructor(
    private readonly groupsService: GroupsService,
    private readonly plannersService: PlannersService,
  ) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(@Query() filter: GroupFilter) {
    return await this.groupsService.findAll(filter);
  }

  @Get(':groupId/planners')
  @HttpCode(HttpStatus.OK)
  async findAllByGroupId(
    @Param('groupId') groupId: string,
    @Query() filter: PlannerFilter,
  ) {
    return await this.plannersService.findAllByGroupId(groupId, filter);
  }

  @Get(':groupId')
  @HttpCode(HttpStatus.OK)
  async findById(@Param('groupId') groupId: string) {
    return await this.groupsService.findById(groupId);
  }
}
