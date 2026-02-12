import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe, Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { apiReference } from '@scalar/nestjs-api-reference';
import type { OpenAPIObject } from '@nestjs/swagger';
import type { INestApplication } from '@nestjs/common';
import type { Request, Response } from 'express';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { AppModule } from './app/app.module.js';

class Main {
  private readonly logger = new Logger('Bootstrap');
  private readonly swaggerPath = 'docs';
  private readonly swaggerJsonPath = 'openapi.json';

  async bootstrap(): Promise<void> {
    const app = await NestFactory.create(AppModule);
    const configService = app.get(ConfigService);
    const port = configService.getOrThrow<number>('PORT');
    const isDocsEnabled =
      configService.get<boolean>('ENABLE_API_DOCS') ??
      configService.get<string>('NODE_ENV') !== 'production';

    if (isDocsEnabled) {
      const document = this.createSwaggerDocument(app);
      this.setupOpenApiJsonEndpoint(app, document);
      this.setupScalarReference(app);
      this.logger.log(`API docs enabled at /${this.swaggerPath}`);
    }

    this.setupValidation(app);
    this.setupCors(app);
    this.setupSecurity(app);
    app.use(cookieParser());

    await app.listen(port, '0.0.0.0');

    this.logger.log(`Backend running on http://0.0.0.0:${port}`);
  }

  private createSwaggerDocument(app: INestApplication): OpenAPIObject {
    const config = new DocumentBuilder()
      .setTitle('Maalesef API')
      .setDescription('The Maalesef API documentation')
      .setVersion('1.0')
      .addBearerAuth()
      .build();

    return SwaggerModule.createDocument(app, config);
  }

  private setupOpenApiJsonEndpoint(
    app: INestApplication,
    document: OpenAPIObject,
  ): void {
    app.use(`/${this.swaggerJsonPath}`, (_req: Request, res: Response) => {
      res.setHeader('Cache-Control', 'public, max-age=300');
      res.json(document);
    });
  }

  private setupScalarReference(app: INestApplication): void {
    app.use(
      `/${this.swaggerPath}`,
      apiReference({
        url: `/${this.swaggerJsonPath}`,
        pageTitle: 'Maalesef API Docs',
        theme: 'purple',
        withDefaultFonts: false,
        hideDownloadButton: true,
        hideTestRequestButton: true,
        showDeveloperTools: 'localhost',
      }),
    );
  }

  private setupValidation(app: INestApplication): void {
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: {
          enableImplicitConversion: true,
        },
      }),
    );
  }

  private setupCors(app: INestApplication): void {
    const configService = app.get(ConfigService);
    const raw = configService.get<string>('CORS_ORIGIN') ?? '';
    const allowedOrigins = raw
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    app.enableCors({
      origin: (
        origin: string | undefined,
        callback: (err: Error | null, origin?: boolean) => void,
      ) => {
        // allow requests with no origin (server-to-server, curl, same-origin)
        if (!origin) {
          callback(null, true);
          return;
        }
        if (allowedOrigins.length === 0) {
          callback(null, true);
          return;
        }
        if (allowedOrigins.includes(origin)) {
          callback(null, true);
          return;
        }
        callback(new Error('Origin not allowed by CORS'));
      },
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
      exposedHeaders: ['Set-Cookie'],
    });
  }

  private setupSecurity(app: INestApplication): void {
    app.use(helmet());
  }
}

void new Main().bootstrap();
