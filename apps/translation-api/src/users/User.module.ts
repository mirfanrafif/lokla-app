import { Module, OnModuleInit } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { UserController } from './User.controller';
import { UserModel, UserSchema } from './User.schema';
import { UserService } from './User.service';

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
  constructor(private userService: UserService) {}

  async onModuleInit() {
    try {
      await this.userService.createUser({
        email: 'admin@admin.com',
        fullName: 'Admin',
        password: '12345678',
        projects: [],
        role: 'admin',
      });
    } catch (error) {
      //
    }
  }
}
