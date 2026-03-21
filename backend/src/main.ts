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
      logger: ['error', 'warn'],
    });

    instance.setGlobalPrefix('api');

    instance.enableCors({
      origin: [
        'http://localhost:5173',
        'https://reginarecycle.vercel.app',
        'https://regina-recycle-staging.vercel.app',
      ],
      credentials: true,
    });

    instance.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
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
      customCssUrl: 'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.11.0/swagger-ui.min.css',
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

// Local dev — spin up a real HTTP server
if (!process.env.VERCEL) {
  const port = process.env.PORT || 4000;
  createApp().then(instance => {
    instance.listen(port, () =>
      console.log(`Running on http://localhost:${port}`),
    );
  });
}

// Vercel serverless — raw Node handler, no Express/Fastify
export default async function handler(
  req: IncomingMessage,
  res: ServerResponse,
) {
  const nestApp = await createApp();

  // NestJS wraps Node's http server internally.
  // We pull the underlying http.Server and emit the request directly into it.
  const httpServer = nestApp.getHttpServer(); // returns http.Server (Node built-in)
  httpServer.emit('request', req, res);
}