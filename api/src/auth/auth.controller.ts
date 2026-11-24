import { Body, Controller, Post } from '@nestjs/common';
import { CredentialsService } from './credentials.service.js';
import { signUpSchema, type SignUpDto } from './auth.schemas.js';

@Controller('auth')
export class AuthController {
  constructor(private readonly credentials: CredentialsService) {}

  /** Creates a PLAYER account: 201 { id, email, role }. */
  @Post('register')
  register(@Body({ schema: signUpSchema }) body: SignUpDto) {
    return this.credentials.register(body.email, body.password);
  }
}
