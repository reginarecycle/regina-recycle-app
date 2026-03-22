import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, INestApplication } from '@nestjs/common';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { ResponseInterceptor } from './common/interceptor/response.interceptor';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import type { IncomingMessage, ServerResponse } from 'http';

let app: INestApplication | null = null;
let initPromise: Promise<INestApplication> | null = null;

async function createApp(): Promise<INestApplication> {
  if (app) return app;
  if (initPromise) return initPromise;

  initPromise = (async () => {
    const instance = await NestFactory.create(AppModule, {
      bodyParser: true,
      logger: process.env.VERCEL ? ['error', 'warn'] : ['log', 'fatal', 'error', 'warn', 'debug', 'verbose'],
    });

    instance.setGlobalPrefix('api');

    instance.enableCors({
      origin: true,
      credentials: true,
    });

    instance.useGlobalPipes(
      new ValidationPipe({ whitelist: true, transform: true }),
    );
    instance.useGlobalInterceptors(new ResponseInterceptor());
    instance.useGlobalFilters(new HttpExceptionFilter());

    const config = new DocumentBuilder()
      .setTitle('ReginaRecycle API')
      .setDescription('ReginaRecycle backend API documentation')
      .setVersion('1.0')
      .addBearerAuth(
        { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
        'JWT-auth',
      )
      .build();

    const document = SwaggerModule.createDocument(instance, config);
    SwaggerModule.setup('docs', instance, document, {
      customCssUrl:
        'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.11.0/swagger-ui.min.css',
      customJs: [
        'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.11.0/swagger-ui-standalone-preset.min.js',
        'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.11.0/swagger-ui-bundle.min.js',
      ],
      swaggerOptions: { persistAuthorization: true },
      customSiteTitle: 'ReginaRecycle API Docs',
    });

    await instance.init();
    app = instance;
    return app;
  })();

  return initPromise;
}

// Local dev
if (!process.env.VERCEL) {
  const port = process.env.PORT || 4000;
  createApp().then((instance) => {
    instance.listen(port, () =>
      console.log(`Running on http://localhost:${port}`),
    );
  });
}

// Vercel serverless
export default async function handler(
  req: IncomingMessage,
  res: ServerResponse,
) {
  const nestApp = await createApp();
  nestApp.getHttpServer().emit('request', req, res);
}