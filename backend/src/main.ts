import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { ResponseInterceptor } from './common/interceptor/response.interceptor';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { join } from 'path';
import { writeFileSync } from 'fs';
import  express from 'express';
import { ExpressAdapter } from '@nestjs/platform-express';

const server = express();

async function bootstrap() {
  const app = await NestFactory.create(AppModule , new ExpressAdapter(server));
  app.setGlobalPrefix('api')

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

bootstrap();

export default server;