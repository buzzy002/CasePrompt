import { Module } from '@nestjs/common';
import { PasswordHasher } from '@nestjs/authentication';
import { UsersModule } from '../users/users.module.js';
import { AuthController } from './auth.controller.js';
import { CredentialsService } from './credentials.service.js';

@Module({
  imports: [UsersModule],
  controllers: [AuthController],
  providers: [
    CredentialsService,
    // Hashes passwords with scrypt. The login step will register
    // AuthenticationModule, which provides it, and this line will go.
    { provide: PasswordHasher, useValue: new PasswordHasher() },
  ],
})
export class AuthModule {}
