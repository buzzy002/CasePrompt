import { Injectable } from '@nestjs/common';
import { PasswordHasher } from '@nestjs/authentication';
import { UsersRepository } from '../users/users.repository.js';
import type { User } from '../users/user.js';

@Injectable()
export class CredentialsService {
  constructor(
    private readonly users: UsersRepository,
    private readonly passwordHasher: PasswordHasher,
  ) {}

  /** Every new account is a PLAYER: the role never comes from the request. */
  async register(email: string, password: string): Promise<User> {
    return this.users.create(email, await this.passwordHasher.hash(password));
  }
}
