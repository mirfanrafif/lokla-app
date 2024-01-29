import { HeaderAPIKeyStrategy } from 'passport-headerapikey';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './Auth.service';
@Injectable()
export class ApiKeyStrategy extends PassportStrategy(
  HeaderAPIKeyStrategy,
  'api-key',
) {
  constructor(private authService: AuthService) {
    super(
      { header: 'Authorization', prefix: 'Api-Key ' },
      true,
      async (apikey, done) => {
        const project = await this.authService.validateApiKey(apikey);
        if (!project) {
          return done(new UnauthorizedException('Invalid API Key'), false);
        }

        return done(null, project);
      },
    );
  }
}
