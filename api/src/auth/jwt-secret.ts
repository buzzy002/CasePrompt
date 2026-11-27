/** Below this, the HMAC key that signs the tokens can be brute-forced. */
export const MIN_JWT_SECRET_BYTES = 32;

/**
 * The JWT_SECRET to sign tokens with. Throws at startup when it is missing or
 * too short, instead of starting an API whose tokens are weak or unsigned.
 */
export function readJwtSecret(value = process.env.JWT_SECRET): string {
  const secret = value?.trim();
  if (!secret) {
    throw new Error(
      'JWT_SECRET est manquant : ajoutez-le dans le fichier .env (voir .env.example).',
    );
  }
  const bytes = Buffer.byteLength(secret, 'utf8');
  if (bytes < MIN_JWT_SECRET_BYTES) {
    throw new Error(
      `JWT_SECRET est trop court (${bytes} octets, minimum ${MIN_JWT_SECRET_BYTES}). ` +
        "Générez-en un avec : node -e \"console.log(require('crypto').randomBytes(32).toString('base64'))\"",
    );
  }
  return secret;
}
