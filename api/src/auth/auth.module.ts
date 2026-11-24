import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module.js';
import { AuthController } from './auth.controller.js';
import { CredentialsService } from './credentials.service.js';
import { JwtAuth } from './jwt.auth.js';

@Module({
  imports: [UsersModule],
  controllers: [AuthController],
  // PasswordHasher and TokenService come from AuthenticationModule (AppModule).
  providers: [CredentialsService, JwtAuth],
})
export class AuthModule {}
