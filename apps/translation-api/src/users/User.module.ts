import { Module, OnModuleInit } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { UserController } from './User.controller';
import { UserModel, UserSchema } from './User.schema';
import { UserService } from './User.service';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: UserModel.name,
        schema: UserSchema,
      },
    ]),
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [
    MongooseModule.forFeature([
      {
        name: UserModel.name,
        schema: UserSchema,
      },
    ]),
  ],
})
export class UserModule implements OnModuleInit {
  constructor(private userService: UserService, private configService: ConfigService) {}

  async onModuleInit() {
    try {
      await this.userService.createUser({
        email: this.configService.get<string>('ADMIN_EMAIL'),
        fullName: this.configService.get<string>('ADMIN_NAME'),
        password: this.configService.get<string>('ADMIN_PASSWORD'),
        projects: [],
        role: 'admin',
      });
    } catch (error) {
      //
    }
  }
}
