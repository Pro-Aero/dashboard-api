import { Module } from '@nestjs/common';
import { EnvService } from './env.service';

@Module({
  exports: [EnvService],
  controllers: [],
  providers: [EnvService],
})
export class EnvModule {}
