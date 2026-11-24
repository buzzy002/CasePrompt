import { Controller, Get } from '@nestjs/common';
import { Can } from '@nestjs/authorization';
import { UsersRepository } from './users.repository.js';
import { UserPolicy } from './user.policy.js';

@Controller('users')
export class UsersController {
  constructor(private readonly users: UsersRepository) {}

  /** Administrators only: a player gets 403, a guest 401. */
  @Get()
  @Can(UserPolicy, 'list')
  findAll() {
    return this.users.findAll();
  }
}
