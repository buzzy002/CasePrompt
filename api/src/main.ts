import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { StandardSchemaValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Every route starts with /api: /api/auth/register…
  app.setGlobalPrefix('api');
  // The Vue front (Vite) runs on another port: allow it to call the API.
  app.enableCors({
    origin: process.env.FRONT_URL ?? 'http://localhost:5173',
  });
  // Checks every @Body({ schema }) against its Zod schema: 400 when it fails.
  app.useGlobalPipes(new StandardSchemaValidationPipe());
  await app.listen(process.env.PORT ?? 3000);
}
await bootstrap();
