import { Module } from '@nestjs/common';
import { UsersController } from './users.controller.js';
import { UsersRepository } from './users.repository.js';
import { UserPolicy } from './user.policy.js';

@Module({
  controllers: [UsersController],
  providers: [UsersRepository, UserPolicy],
  exports: [UsersRepository],
})
export class UsersModule {}
