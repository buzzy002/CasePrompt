import { ConflictException, Injectable } from '@nestjs/common';
import { Prisma } from '../generated/prisma/client.js';
import { PrismaService } from '../prisma/prisma.service.js';
import type { User } from './user.js';

/** The columns the app may see: never the password hash. */
const PUBLIC_FIELDS = { id: true, email: true, role: true } as const;

@Injectable()
export class UsersRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(email: string, passwordHash: string): Promise<User> {
    try {
      return await this.prisma.user.create({
        data: { email, passwordHash },
        select: PUBLIC_FIELDS,
      });
    } catch (err) {
      // P2002: the unique index on email, also when two sign-ups race.
      if (
        err instanceof Prisma.PrismaClientKnownRequestError &&
        err.code === 'P2002'
      ) {
        throw new ConflictException('Cet email est déjà utilisé');
      }
      throw err;
    }
  }
}
