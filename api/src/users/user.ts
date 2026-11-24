import type { Role } from '../generated/prisma/client.js';

/** A user as the app sees it. The password hash never leaves UsersRepository. */
export interface User {
  id: string;
  email: string;
  role: Role;
}

// Tells @nestjs/authentication what @CurrentUser() returns, and that sign-in
// gives an access token alone (refreshToken: false in AppModule).
declare module '@nestjs/authentication' {
  interface AuthenticationTypes {
    user: User;
    refreshTokens: false;
  }
}
