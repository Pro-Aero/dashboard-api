import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { ApiKeyStrategy } from './api-key.strategy';
import { AuthMiddleware } from './auth.middleware';
import { AuthService } from './auth.service';

@Module({
  imports: [PassportModule],
  providers: [AuthService, ApiKeyStrategy],
})
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes('*');
  }
}
