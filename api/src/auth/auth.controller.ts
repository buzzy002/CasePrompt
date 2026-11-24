import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { CurrentUser, Public, TokenService } from '@nestjs/authentication';
import { Can } from '@nestjs/authorization';
import { CredentialsService } from './credentials.service.js';
import {
  loginSchema,
  signUpSchema,
  type LoginDto,
  type SignUpDto,
} from './auth.schemas.js';
import type { User } from '../users/user.js';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly credentials: CredentialsService,
    private readonly tokens: TokenService,
  ) {}

  /** Creates a PLAYER account: 201 { id, email, role }. */
  @Public()
  @Post('register')
  register(@Body({ schema: signUpSchema }) body: SignUpDto) {
    return this.credentials.register(body.email, body.password);
  }

  /** 200 { accessToken, expiresIn }: send it as `Authorization: Bearer <accessToken>`. */
  @Public()
  @Post('login')
  @HttpCode(200)
  async login(@Body({ schema: loginSchema }) body: LoginDto) {
    const user = await this.credentials.verify(body.email, body.password);
    if (!user) {
      throw new UnauthorizedException('Email ou mot de passe incorrect');
    }
    return this.tokens.issue(user.id, {
      method: 'password',
      claims: { amr: ['pwd'] },
    });
  }

  /** Any signed-in user: their own account. */
  @Get('me')
  @Can.Anyone()
  me(@CurrentUser() user: User) {
    return user;
  }
}
