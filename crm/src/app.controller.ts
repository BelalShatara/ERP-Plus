import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Health')
@Controller()
export class AppController {
  @Get()
  @ApiOperation({ summary: 'Health check endpoint' })
  getHello(): { message: string; service: string } {
    return {
      message: 'CRM Service is running',
      service: 'CRM',
    };
  }
}
