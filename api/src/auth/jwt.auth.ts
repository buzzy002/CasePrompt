import { Injectable } from '@nestjs/common';
import {
  AuthenticationRegistry,
  JwtBearerProvider,
  type JwtClaims,
} from '@nestjs/authentication';
import { UsersRepository } from '../users/users.repository.js';
import type { User } from '../users/user.js';

/** Reads `Authorization: Bearer <token>` on every request and loads its user. */
@Injectable()
export class JwtAuth extends JwtBearerProvider<User> {
  constructor(
    private readonly users: UsersRepository,
    registry: AuthenticationRegistry,
  ) {
    super(); // verifies with the `accessToken` options of AppModule
    registry.registerProvider(this);
  }

  // Runs once the signature and expiry are checked. The user is read from the
  // database, so a deleted account or a changed role applies at once.
  validate({ sub }: JwtClaims) {
    return sub ? this.users.findById(sub) : null;
  }
}
