import { NestFactory } from '@nestjs/core';
import * as compression from 'compression';
import helmet from 'helmet';
import * as morgan from 'morgan';
import { HttpTransformInterceptor } from 'utils/transformers/http-response.transformer';
import { AppModule } from './app.module';
import { AllConfigType } from './config/config.type';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { useContainer } from 'class-validator';


async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'log']
  });

  app.use(compression());
  app.use(helmet());
  app.enableCors({ origin: true });

  //this allows class-validator to use NestJS dependency injection container.
  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  app.enableShutdownHooks();

  const configService = app.get(ConfigService<AllConfigType>);
  app.setGlobalPrefix(
    configService.getOrThrow('app.apiPrefix', { infer: true }),
    {
      exclude: ['/'],
    },
  );

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1'
  });

  app.useGlobalPipes(
    new ValidationPipe({
      disableErrorMessages: configService.getOrThrow('app.isProduction', { infer: true }) ? true : false,
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    })
  );

  //basic request/response console logging library
  app.use(morgan('tiny'));

  //configure global http transform interceptor
  app.useGlobalInterceptors(new HttpTransformInterceptor());

  await app.listen(configService.getOrThrow('app.port', { infer: true }));
  console.log(`Application is running on: ${await app.getUrl()}`);
}


bootstrap();
