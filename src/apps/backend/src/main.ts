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
import { RedisIoAdapter } from './common/websockets/redis-io.adapter.js';
import {
  createOriginValidator,
  getAllowedOrigins,
} from './common/config/cors.util.js';

interface BootstrapContext {
  app: INestApplication;
  configService: ConfigService;
  port: number;
}

class Main {
  private readonly logger = new Logger('Bootstrap');
  private readonly swaggerPath = 'docs';
  private readonly swaggerJsonPath = 'openapi.json';

  async bootstrap(): Promise<void> {
    const context = await this.createContext();

    this.setupDocumentation(context);
    this.configureHttpPipeline(context);
    await this.configureWebSockets(context);
    await this.startServer(context);
  }

  private async createContext(): Promise<BootstrapContext> {
    const app: INestApplication = await NestFactory.create(AppModule);
    const configService = app.get(ConfigService);
    const port = configService.getOrThrow<number>('PORT');

    return {
      app,
      configService,
      port,
    };
  }

  private setupDocumentation({ app, configService }: BootstrapContext): void {
    if (!this.isDocsEnabled(configService)) {
      return;
    }

    const document = this.createSwaggerDocument(app);
    this.setupOpenApiJsonEndpoint(app, document);
    this.setupScalarReference(app);
    this.logger.log(`API docs enabled at /${this.swaggerPath}`);
  }

  private configureHttpPipeline({
    app,
    configService,
  }: BootstrapContext): void {
    this.setupValidation(app);
    this.setupCors(app, configService);
    this.setupSecurity(app);
    app.use(cookieParser());
  }

  private async configureWebSockets({
    app,
    configService,
  }: BootstrapContext): Promise<void> {
    const webSocketAdapter = new RedisIoAdapter(app, configService);

    await webSocketAdapter.connectToRedis();
    app.useWebSocketAdapter(webSocketAdapter);
  }

  private async startServer({ app, port }: BootstrapContext): Promise<void> {
    await app.listen(port, '0.0.0.0');

    this.logger.log(`Backend running on http://0.0.0.0:${port}`);
  }

  private isDocsEnabled(configService: ConfigService): boolean {
    return (
      configService.get<boolean>('ENABLE_API_DOCS') ??
      configService.get<string>('NODE_ENV') !== 'production'
    );
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

  private setupCors(app: INestApplication, configService: ConfigService): void {
    const allowedOrigins = getAllowedOrigins(
      configService.get<string>('CORS_ORIGIN'),
    );

    app.enableCors({
      origin: createOriginValidator(allowedOrigins),
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
