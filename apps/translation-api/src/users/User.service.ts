import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { hash } from 'bcryptjs';
import { Model } from 'mongoose';

import {
  RequestCreateUser,
  RequestDeleteUser,
  RequestUpdateUser,
} from './User.dto';
import { UserModel } from './User.schema';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(UserModel.name) private userModel: Model<UserModel>,
  ) {}

  getAllUsers() {
    return this.userModel.find({}).exec();
  }

  async createUser(request: RequestCreateUser) {
    const newPassword = await hash(request.password, 16);

    return await this.userModel.create({
      fullName: request.fullName,
      email: request.email,
      password: newPassword,
      role: request.role,
    });
  }

  async updateUser(request: RequestUpdateUser) {
    return this.userModel.findOneAndUpdate(
      {
        email: request.oldEmail,
      },
      {
        email: request.email,
        fullName: request.fullName,
        role: request.role,
      },
    );
  }

  async deleteUser(request: RequestDeleteUser) {
    return this.userModel.findOneAndDelete({
      email: request.email,
    });
  }
}
