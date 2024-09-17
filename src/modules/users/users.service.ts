import { Injectable, NotFoundException } from '@nestjs/common';
import { TasksService } from '../tasks/tasks.service';
import { UsersMapper } from './mappers/user.mapper';
import { UserDto, UserFilter } from './models/user.dto';
import { UserEntity } from './models/user.entity';
import { UserRepository } from './repositories/user.repository';

@Injectable()
export class UsersService {
  constructor(
    private readonly repository: UserRepository,
    private readonly tasksService: TasksService,
  ) {}

  async findAll(filter?: UserFilter): Promise<UserDto[]> {
    let users = await this.repository.findAll(filter);
    const usersPromises = users.map(async (user) => {
      user.busyHours = await this.repository.calculateBusyHours(user.id);
      return user;
    });
    users = await Promise.all(usersPromises);
    return users.map(UsersMapper.entityToDTO);
  }

  async findById(userId: string): Promise<UserDto> {
    const user = await this.repository.findById(userId);
    if (!user) throw new NotFoundException();
    user.busyHours = await this.repository.calculateBusyHours(user.id);
    return UsersMapper.entityToDTO(user);
  }

  async exists(userId: string): Promise<boolean> {
    const user = await this.repository.findById(userId);
    return !!user;
  }

  async upsert(user: UserEntity): Promise<void> {
    await this.repository.upsert(user);
  }

  async removeOutdated(apiUsers: UserEntity[]): Promise<void> {
    const dbUsers = await this.repository.findAll();

    const apiUsersMap = new Map(apiUsers.map((user) => [user.id, user]));
    const usersToRemove = dbUsers.filter((user) => !apiUsersMap.has(user.id));

    await Promise.all(
      usersToRemove.map(async (user) => await this.repository.remove(user.id)),
    );
  }
}
