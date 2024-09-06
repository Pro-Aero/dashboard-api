import { Injectable } from '@nestjs/common';
import { UserEntity } from './models/user.entity';
import { UserRepository } from './repositories/user.repository';

@Injectable()
export class UsersService {
  constructor(private readonly repository: UserRepository) {}

  async upsert(user: UserEntity): Promise<UserEntity> {
    return await this.repository.upsert(user);
  }

  async removeOutdated(apiUsers: UserEntity[]): Promise<void> {
    const dbUsers = await this.repository.getAll();

    const apiUsersMap = new Map(apiUsers.map((user) => [user.id, user]));
    const usersToRemove = dbUsers.filter((user) => !apiUsersMap.has(user.id));

    await Promise.all(
      usersToRemove.map(async (user) => await this.repository.remove(user.id)),
    );
  }
}
