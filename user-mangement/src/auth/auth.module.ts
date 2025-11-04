import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { KeyclockService } from 'src/keyclock/keyclock.service';
import { HttpModule } from '@nestjs/axios';
import { KeyclockModule } from 'src/keyclock/keyclock.module';

@Module({
  imports: [HttpModule, KeyclockModule],
  providers: [AuthService],
  controllers: [AuthController]
})
export class AuthModule {}
