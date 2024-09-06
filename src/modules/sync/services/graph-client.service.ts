import { ClientSecretCredential } from '@azure/identity';
import { Client } from '@microsoft/microsoft-graph-client';
import { Injectable } from '@nestjs/common';
import { EnvService } from '../../env/env.service';
import { AzureAuthProvider } from '../providers/azure-auth.provider';

@Injectable()
export class GraphClientService {
  private readonly client: Client;

  constructor(private readonly configService: EnvService) {
    const credential = new ClientSecretCredential(
      this.configService.get('MICROSOFT_TENANT_ID'),
      this.configService.get('MICROSOFT_CLIENT_ID'),
      this.configService.get('MICROSOFT_CLIENT_SECRET'),
    );

    const authProvider = new AzureAuthProvider(credential, [
      'https://graph.microsoft.com/.default',
    ]);

    this.client = Client.initWithMiddleware({
      authProvider,
    });
  }

  getClient(): Client {
    return this.client;
  }
}
