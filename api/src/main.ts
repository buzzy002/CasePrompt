import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { StandardSchemaValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Every route starts with /api: /api/auth/register…
  app.setGlobalPrefix('api');
  // Checks every @Body({ schema }) against its Zod schema: 400 when it fails.
  app.useGlobalPipes(new StandardSchemaValidationPipe());
  await app.listen(process.env.PORT ?? 3000);
}
await bootstrap();
