import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import type { Express, NextFunction, Request, Response } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Bootstrap');
  const normalizeOrigin = (value: string) => value.replace(/\/+$/, '');
  const expressApp = app.getHttpAdapter().getInstance() as Express;

  expressApp.set('trust proxy', true);

  app.use((req: Request, _res: Response, next: NextFunction) => {
    const originHeader = req.headers.origin;
    const forwardedFor = req.headers['x-forwarded-for'];
    const clientIp = req.headers['cf-connecting-ip'];
    let requestIp = req.ip;

    if (Array.isArray(clientIp)) {
      requestIp = clientIp[0] ?? req.ip;
    } else if (clientIp) {
      requestIp = clientIp;
    } else if (Array.isArray(forwardedFor)) {
      requestIp = forwardedFor[0] ?? req.ip;
    } else if (forwardedFor) {
      requestIp = forwardedFor.split(',')[0]?.trim() ?? req.ip;
    }

    if (originHeader || req.method === 'OPTIONS') {
      logger.log(
        `Incoming request ${req.method} ${req.originalUrl} origin=${originHeader ?? '(none)'} ip=${requestIp}`,
      );
    }

    next();
  });

  const allowedOrigins = (process.env.CORS_ORIGIN ?? '')
    .split(',')
    .map((origin) => origin.trim())
    .map((origin) => normalizeOrigin(origin))
    .filter(Boolean);
  const allowedOriginSet = new Set(allowedOrigins);

  logger.log(
    `Allowed CORS origins: ${allowedOrigins.length > 0 ? allowedOrigins.join(', ') : '(none configured)'}`,
  );

  app.enableCors({
    origin: (
      origin: string | undefined,
      callback: (err: Error | null, allow?: boolean) => void,
    ) => {
      if (!origin) {
        callback(null, true);
        return;
      }

      if (allowedOriginSet.size === 0) {
        callback(null, false);
        return;
      }

      const normalizedOrigin = normalizeOrigin(origin);
      const isAllowed = allowedOriginSet.has(normalizedOrigin);

      if (!isAllowed) {
        logger.warn(`Blocked CORS origin: ${normalizedOrigin}`);
      }

      callback(null, isAllowed);
    },
    credentials: true,
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('openGol API')
    .setDescription(
      'Documentación de la API para la gestión de partidos y usuarios',
    )
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Ingresa el token jwt',
        in: 'header',
      },
      'access-token',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(process.env.PORT ?? 3000);
  console.log('😶‍🌫️servidor corriendo en: http://localhost:3000');
  console.log('documentacion en http://localhost:3000/api/docs');
}

void bootstrap();
