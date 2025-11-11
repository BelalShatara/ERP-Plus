
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private readonly MAX_LENGTH = 500;

  private truncateString(value: any): string {
    const str = typeof value === 'string' ? value : JSON.stringify(value);
    return str.length > this.MAX_LENGTH 
      ? str.substring(0, this.MAX_LENGTH) + '...[truncated]'
      : str;
  }

  use(req: Request, res: Response, next: NextFunction) {
    console.log('=== Incoming Request ===');
    console.log(`Method: ${req.method}`);
    console.log(`URL: ${this.truncateString(req.originalUrl)}`);
    console.log(`Body:`, this.truncateString(req.body));
    console.log(`Params:`, this.truncateString(req.params));
    console.log(`Query:`, this.truncateString(req.query));
    console.log(`Headers:`, this.truncateString(req.headers));
    console.log(`IP: ${req.ip}`);
    console.log(`Hostname: ${req.hostname}`);
    console.log(`Protocol: ${req.protocol}`);
    console.log(`Secure: ${req.secure}`);
    console.log('========================');

    next();
  }
}