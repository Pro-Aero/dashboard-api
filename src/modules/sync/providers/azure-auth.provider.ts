import { ClientSecretCredential } from '@azure/identity';
import { AuthenticationProvider } from '@microsoft/microsoft-graph-client';
import 'isomorphic-fetch';

export class AzureAuthProvider implements AuthenticationProvider {
  private credential: ClientSecretCredential;
  private scopes: string[];

  constructor(credential: ClientSecretCredential, scopes: string[]) {
    this.credential = credential;
    this.scopes = scopes;
  }

  async getAccessToken(): Promise<string> {
    const tokenResponse = await this.credential.getToken(this.scopes);
    if (!tokenResponse || !tokenResponse.token) {
      throw new Error('Unable to retrieve access token');
    }
    return tokenResponse.token;
  }
}
