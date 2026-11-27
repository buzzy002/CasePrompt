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

  it('refuses the same email with other case or spaces', () => {
    return request(app.getHttpServer())
      .post('/auth/register')
      .send({ email: `  ${email.toUpperCase()} `, password })
      .expect(409);
  });

  it('stores the email trimmed and lowercased', async () => {
    const other = `test-${randomUUID()}@test.fr`;
    const res = await request(app.getHttpServer())
      .post('/auth/register')
      .send({ email: ` ${other.toUpperCase()}  `, password })
      .expect(201);
    expect(res.body.email).toBe(other);
    await prisma.user.delete({ where: { email: other } });
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

// Runs after the sign-up tests above, with the account they created.
describe('Login (e2e)', () => {
  let app: INestApplication<App>;
  let prisma: PrismaService;
  const email = `test-${randomUUID()}@test.fr`;
  const password = 'secret123';

  const login = async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email, password })
      .expect(200);
    return res.body.accessToken as string;
  };

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({ imports: [AppModule] })
      .overrideProvider(PasswordHasher)
      .useValue(new PasswordHasher({ logN: 10 }))
      .compile();
    app = moduleRef.createNestApplication();
    app.useGlobalPipes(new StandardSchemaValidationPipe());
    await app.init();
    prisma = app.get(PrismaService);
    await request(app.getHttpServer())
      .post('/auth/register')
      .send({ email, password })
      .expect(201);
  });

  afterAll(async () => {
    await prisma.user.deleteMany({ where: { email } });
    await app.close();
  });

  it('returns an access token, and no refresh token', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email, password })
      .expect(200);
    expect(res.body).toEqual({
      accessToken: expect.any(String),
      expiresIn: 86400,
    });
  });

  it('accepts the email with other case or spaces', () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: ` ${email.toUpperCase()} `, password })
      .expect(200);
  });

  it('refuses a wrong password and an unknown email with the same message', async () => {
    const wrong = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email, password: 'wrong-password' })
      .expect(401);
    const unknown = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: `nobody-${randomUUID()}@test.fr`, password })
      .expect(401);
    expect(wrong.body.message).toBe('Email ou mot de passe incorrect');
    expect(unknown.body.message).toBe(wrong.body.message);
  });

  it('returns the logged-in user, never the password hash', async () => {
    const res = await request(app.getHttpServer())
      .get('/auth/me')
      .set('Authorization', `Bearer ${await login()}`)
      .expect(200);
    expect(res.body).toEqual({ id: expect.any(String), email, role: 'PLAYER' });
  });

  it('protects routes by default: no token or a forged one gets 401', async () => {
    await request(app.getHttpServer()).get('/auth/me').expect(401);
    await request(app.getHttpServer())
      .get('/auth/me')
      .set('Authorization', `Bearer ${await login()}x`)
      .expect(401);
  });

  it('keeps the user list for administrators', async () => {
    const token = await login();
    await request(app.getHttpServer()).get('/users').expect(401);
    await request(app.getHttpServer())
      .get('/users')
      .set('Authorization', `Bearer ${token}`)
      .expect(403);

    await prisma.user.update({
      where: { email },
      data: { role: 'ADMINISTRATOR' },
    });
    // Same token: the role is read from the database on each request.
    const res = await request(app.getHttpServer())
      .get('/users')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
    expect(res.body).toContainEqual({
      id: expect.any(String),
      email,
      role: 'ADMINISTRATOR',
    });
    expect(JSON.stringify(res.body)).not.toContain('passwordHash');
  });
});
