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

    await this.usersService.removeOutdated(users);
  }

  async getUsers(): Promise<UserEntity[]> {
    const { value }: UserResponse = await this.client
      .api('/users')
      .select('id,displayName,userPrincipalName,mail,jobTitle')
      .get();

    return this.filterUsers(value);
  }

  filterUsers(users: UserEntity[]): UserEntity[] {
    const domains = ['@proaero.aero', '@flyaxis.aero'];
    const emailsToExclude = new Set([
      'barbara.sena@proaero.aero',
      'irai.silva@proaero.aero',
      'paulo.verdelli@proaero.aero',
      'priscila.sampaio@proaero.aero',
      'TI@proaero.aero',
      'ctm@proaero.aero',
      'leonardo.lanza@proaero.aero',
      'vladimir@proaero.aero',
    ]);

    return users.filter((user) =>
      domains.some((domain) => {
        if (
          user.mail &&
          user.mail.endsWith(domain) &&
          !emailsToExclude.has(user.mail)
        ) {
          return true;
        }

        return false;
      }),
    );
  }
}
