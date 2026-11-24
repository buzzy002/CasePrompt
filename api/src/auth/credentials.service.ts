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

  /** The user, or null for a wrong email or password. */
  async verify(email: string, password: string): Promise<User | null> {
    const found = await this.users.findCredentials(email);
    // Called even for an unknown email: it then checks a dummy hash, so the
    // response time does not reveal which emails have an account.
    const valid = await this.passwordHasher.verify(
      password,
      found?.passwordHash,
    );
    return valid && found ? found.user : null;
  }
}
