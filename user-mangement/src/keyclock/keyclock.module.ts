import { Module } from '@nestjs/common';
import { KeyclockService } from './keyclock.service';
import { HttpModule } from '@nestjs/axios';

@Module({
    imports: [HttpModule],
    providers: [KeyclockService],
    exports: [KeyclockService],
})
export class KeyclockModule {}
