import { Module } from '@nestjs/common';
import { AuthenticationModule } from '@nestjs/authentication';
import { AuthorizationModule } from '@nestjs/authorization';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { AuthModule } from './auth/auth.module.js';
import { readJwtSecret } from './auth/jwt-secret.js';
import { PrismaModule } from './prisma/prisma.module.js';
import { UsersModule } from './users/users.module.js';

@Module({
  imports: [
    PrismaModule,
    // Authentication before authorization: its guard sets the user that policies read.
    // Every route then needs a signed-in user, unless it is marked @Public().
    AuthenticationModule.forRootAsync({
      useFactory: () => ({
        accessToken: {
          // Throws when JWT_SECRET is missing or too short: the API does not start.
          key: readJwtSecret(),
          issuer: 'case-prompt',
          audience: 'api',
          ttl: '1d',
        },
        // No refresh tokens: when the access token expires, the player logs in again.
        // Nothing is stored for tokens, so no extra table is needed.
        refreshToken: false,
      }),
    }),
    // Denies by default: each route declares @Can(...), @Can.Anyone() or @Public().
    AuthorizationModule.forRoot(),
    UsersModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
