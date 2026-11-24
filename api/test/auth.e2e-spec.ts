import { randomUUID } from 'node:crypto';
import { Test } from '@nestjs/testing';
import { INestApplication, StandardSchemaValidationPipe } from '@nestjs/common';
import { PasswordHasher } from '@nestjs/authentication';
import request from 'supertest';
import { App } from 'supertest/types.js';
import { AppModule } from './../src/app.module.js';
import { PrismaService } from './../src/prisma/prisma.service.js';

// Needs the database of DATABASE_URL, migrated (npx prisma migrate dev).
describe('Sign-up (e2e)', () => {
  let app: INestApplication<App>;
  let prisma: PrismaService;
  const email = `test-${randomUUID()}@test.fr`;
  const password = 'secret123';

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({ imports: [AppModule] })
      // A cheaper hash: the real cost takes ~100 ms per hash.
      .overrideProvider(PasswordHasher)
      .useValue(new PasswordHasher({ logN: 10 }))
      .compile();
    app = moduleRef.createNestApplication();
    app.useGlobalPipes(new StandardSchemaValidationPipe());
    await app.init();
    prisma = app.get(PrismaService);
  });

  afterAll(async () => {
    await prisma.user.deleteMany({ where: { email } });
    await app.close();
  });

  it('creates a PLAYER account without returning the hash', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/register')
      .send({ email, password })
      .expect(201);
    expect(res.body).toEqual({ id: expect.any(String), email, role: 'PLAYER' });
  });

  it('stores a hash, never the password', async () => {
    const user = await prisma.user.findUniqueOrThrow({ where: { email } });
    expect(user.passwordHash).not.toContain(password);
    expect(user.passwordHash).toMatch(/^\$scrypt\$/);
  });

  it('refuses a second account with the same email', () => {
    return request(app.getHttpServer())
      .post('/auth/register')
      .send({ email, password })
      .expect(409);
  });

  it('refuses a bad email or a short password, in French', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/register')
      .send({ email: 'not-an-email', password: 'short' })
      .expect(400);
    expect(res.body.message).toEqual([
      'email: Adresse email invalide',
      'password: Le mot de passe doit contenir au moins 8 caractères',
    ]);
  });

  it('refuses a missing password, in French', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/register')
      .send({ email })
      .expect(400);
    expect(res.body.message).toEqual(['password: Mot de passe obligatoire']);
  });

  it('ignores a role sent in the body', async () => {
    const other = `test-${randomUUID()}@test.fr`;
    const res = await request(app.getHttpServer())
      .post('/auth/register')
      .send({ email: other, password, role: 'ADMINISTRATOR' })
      .expect(201);
    expect(res.body.role).toBe('PLAYER');
    await prisma.user.delete({ where: { email: other } });
  });
});
