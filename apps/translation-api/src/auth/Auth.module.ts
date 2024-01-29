import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { ProjectModule } from '../projects/Project.module';
import { UserModule } from '../users/User.module';
import { ApiKeyStrategy } from './ApiKey.strategy';
import { AuthController } from './Auth.controller';
import { AuthService } from './Auth.service';
import { JwtStrategy } from './Jwt.strategy';
import { RolesGuard } from './Role.guard';

@Module({
  imports: [
    UserModule,
    ProjectModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        return {
          secret: configService.get('JWT_SECRET'),
          signOptions: {
            expiresIn: '1d',
          },
        };
      },
      inject: [ConfigService],
    }),
    ConfigModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    RolesGuard,
    ConfigService,
    ApiKeyStrategy,
  ],
})
export class AuthModule {}
