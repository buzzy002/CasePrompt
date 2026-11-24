import type { Role } from '../generated/prisma/client.js';

/** A user as the app sees it. The password hash never leaves UsersRepository. */
export interface User {
  id: string;
  email: string;
  role: Role;
}
