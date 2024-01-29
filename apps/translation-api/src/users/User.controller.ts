import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { Role } from 'enums/Role.enum';

import { JwtAuthGuard } from '../auth/Jwt.guard';
import { Roles } from '../auth/Role.decorator';
import {
  RequestCreateUser,
  RequestDeleteUser,
  RequestUpdateUser,
} from './User.dto';
import { UserService } from './User.service';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private service: UserService) {}

  @Get()
  @Roles(Role.Admin)
  getAllUsers() {
    return this.service.getAllUsers();
  }

  @Post()
  addUser(@Body() request: RequestCreateUser) {
    return this.service.createUser(request);
  }

  @Put()
  updateUser(@Body() request: RequestUpdateUser) {
    return this.service.updateUser(request);
  }

  @Delete()
  deleteUser(@Body() request: RequestDeleteUser) {
    return this.service.deleteUser(request);
  }
}
