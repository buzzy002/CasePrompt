import { readJwtSecret } from './jwt-secret.js';

describe('readJwtSecret', () => {
  const valid = 'a'.repeat(32);

  it('returns a secret of at least 32 bytes', () => {
    expect(readJwtSecret(valid)).toBe(valid);
  });

  it('refuses a missing or blank secret', () => {
    expect(() => readJwtSecret(undefined)).toThrow('JWT_SECRET est manquant');
    expect(() => readJwtSecret('')).toThrow('JWT_SECRET est manquant');
    expect(() => readJwtSecret('   ')).toThrow('JWT_SECRET est manquant');
  });

  it('refuses a secret shorter than 32 bytes', () => {
    expect(() => readJwtSecret('a'.repeat(31))).toThrow(
      'JWT_SECRET est trop court (31 octets, minimum 32)',
    );
  });

  it('ignores surrounding spaces when measuring', () => {
    expect(() => readJwtSecret(`  ${'a'.repeat(31)}  `)).toThrow(
      'trop court',
    );
  });
});
