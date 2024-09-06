import { Client } from '@microsoft/microsoft-graph-client';
import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/modules/users/users.service';
import { UserEntity } from '../../users/models/user.entity';
import { GraphClientService } from './graph-client.service';

type UserResponse = {
  value: UserEntity[];
};

@Injectable()
export class SyncUsersService {
  private client: Client;

  constructor(
    private readonly graphClientService: GraphClientService,
    private readonly usersService: UsersService,
  ) {
    this.client = this.graphClientService.getClient();
  }

  async sync() {
    const users = await this.getUsers();

    await Promise.all(
      users.map(async (user) => await this.usersService.upsert(user)),
    );

    await this.usersService.removeOutdatedUsers(users);
  }

  async getUsers(): Promise<UserEntity[]> {
    const { value }: UserResponse = await this.client
      .api('/users')
      .select('id,displayName,userPrincipalName,mail,jobTitle')
      .get();

    return value;
  }
}
