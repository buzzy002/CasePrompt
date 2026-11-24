import { Policy } from '@nestjs/authorization';
import type { User } from './user.js';

/** Who may do what with accounts. Routes check it with @Can(UserPolicy, '<ability>'). */
@Policy()
export class UserPolicy {
  // `null` is a guest: the check runs even before anyone has logged in.
  list(user: User | null) {
    return user?.role === 'ADMINISTRATOR';
  }
}
