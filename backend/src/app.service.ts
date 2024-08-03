import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Welcome to the Course Rules Management System API';
  }

  checkHealth(): { status: string; timestamp: number } {
    return {
      status: 'OK',
      timestamp: Date.now(),
    };
  }
}