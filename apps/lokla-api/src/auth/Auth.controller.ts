import { Body, Controller, Post } from '@nestjs/common';

import { RequestLogin } from './Auth.dto';
import { AuthService } from './Auth.service';

@Controller('auth')
export class AuthController {
  constructor(private service: AuthService) {}

  @Post('login')
  login(@Body() request: RequestLogin) {
    return this.service.login(request);
  }
}
