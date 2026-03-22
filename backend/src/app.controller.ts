// src/app.controller.ts
import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get('test')
  test() {
    return { 
      message: 'API is working!',
      timestamp: new Date().toISOString(),
      env: process.env.NODE_ENV,
      vercel: process.env.VERCEL,
      nodeEnv: process.env.NODE_ENV
    };
  }
  
  @Get()
  root() {
    return { message: 'ReginaRecycle API is running' };
  }
}