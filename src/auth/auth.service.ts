import { Injectable } from '@nestjs/common';
import { EnvService } from 'src/modules/env/env.service';

@Injectable()
export class AuthService {
  private readonly apiKey: string;

  constructor(private readonly configService: EnvService) {
    this.apiKey = this.configService.get('API_KEY');
  }

  validateApiKey(apiKey: string): boolean {
    return this.apiKey === apiKey;
  }
}
