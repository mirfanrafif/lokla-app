import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { compare } from 'bcryptjs';
import { Model } from 'mongoose';

import { UserModel } from '../users/User.schema';
import { RequestLogin } from './Auth.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(UserModel.name) private userModel: Model<UserModel>,
    private jwtService: JwtService,
  ) {}
  async login(request: RequestLogin) {
    const user = await this.userModel.findOne({
      email: request.email,
    });

    if (user === null) {
      throw new UnauthorizedException('User not found');
    }

    const isPasswordValid = await compare(request.password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Password mismatch');
    }

    console.log(user);

    const payload = { email: user.email, role: user.role, fullName: user.fullName };

    console.log(payload);

    return {
      accessToken: await this.jwtService.signAsync(payload),
      user: payload,
    };
  }

  async validateUser(payload) {
    const isUserFound = await this.userModel.findOne({
      email: payload.email,
    });

    return isUserFound;
  }
}
