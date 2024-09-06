import { Controller } from '@nestjs/common';
import { PlannersService } from './planners.service';

@Controller('planners')
export class PlannersController {
  constructor(private readonly plannersService: PlannersService) {}
}
