import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { EnvService } from './modules/env/env.service';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(EnvService);
  const port = configService.get('PORT');

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      forbidNonWhitelisted: true,
      whitelist: true,
    }),
  );

  await app.listen(port);
}
bootstrap();
