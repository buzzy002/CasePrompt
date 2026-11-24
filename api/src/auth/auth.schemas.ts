import { z } from 'zod';

// The game is in French: these messages can reach the player.
export const signUpSchema = z.object({
  email: z.email({ error: 'Adresse email invalide' }),
  password: z
    .string({ error: 'Mot de passe obligatoire' })
    .min(8, { error: 'Le mot de passe doit contenir au moins 8 caractères' })
    .max(128, {
      error: 'Le mot de passe doit contenir au plus 128 caractères',
    }),
});
export type SignUpDto = z.infer<typeof signUpSchema>;

// No minimum length at login: a wrong password gets the same 401 as any other.
export const loginSchema = z.object({
  email: z.email({ error: 'Adresse email invalide' }),
  password: z
    .string({ error: 'Mot de passe obligatoire' })
    .min(1, { error: 'Mot de passe obligatoire' })
    .max(128, {
      error: 'Le mot de passe doit contenir au plus 128 caractères',
    }),
});
export type LoginDto = z.infer<typeof loginSchema>;
