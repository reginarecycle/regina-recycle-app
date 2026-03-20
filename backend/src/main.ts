import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { ResponseInterceptor } from './common/interceptor/response.interceptor';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { join } from 'path';
import { writeFileSync } from 'fs';
import { INestApplication } from '@nestjs/common';

// Store app instance for reuse
let app: INestApplication | null = null;

async function createApp(): Promise<INestApplication> {
  if (!app) {
    app = await NestFactory.create(AppModule);
    
    app.setGlobalPrefix('api');

    app.enableCors({
      origin: [
        'http://localhost:5173',
        'https://reginarecycle.vercel.app',
        'https://regina-recycle-staging.vercel.app',
      ],
      credentials: true,
    });

    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    app.useGlobalInterceptors(new ResponseInterceptor());
    app.useGlobalFilters(new HttpExceptionFilter());

    const config = new DocumentBuilder()
      .setTitle('ReginaRecycle API')
      .setDescription('ReginaRecycle backend API documentation')
      .setVersion('1.0')
      .addBearerAuth(
        { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
        'JWT-auth',
      )
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('docs', app, document, {
      customCssUrl: 'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.11.0/swagger-ui.min.css',
      customJs: [
        'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.11.0/swagger-ui-bundle.min.js',
        'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.11.0/swagger-ui-standalone-preset.min.js',
      ],
      swaggerOptions: { persistAuthorization: true },
      customSiteTitle: 'ReginaRecycle API Docs',
    });
    
    const outputPath = join(process.cwd(), 'swagger-spec.json');
    writeFileSync(outputPath, JSON.stringify(document, null, 2));
    
    await app.init();
  }
  return app;
}

// Check if we're running on Vercel
const isVercel = process.env.VERCEL === '1';

// For local development - listen on port
if (!isVercel) {
  const port = process.env.PORT || 3000;
  createApp().then(app => {
    app.listen(port);
    console.log(`Application is running on: http://localhost:${port}`);
  }).catch(error => {
    console.error('Failed to start application:', error);
  });
}

// For Vercel - export the app handler
export default async function handler(req: any, res: any) {
  const app = await createApp();
  const httpAdapter = app.getHttpAdapter();
  const instance = httpAdapter.getInstance();
  instance(req, res);
}