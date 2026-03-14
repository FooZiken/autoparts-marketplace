import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';

@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller('users')
export class UsersController {

  constructor(private readonly usersService: UsersService) {}

 @Roles('admin')
@Get()
async findAll() {
  return this.usersService.findAll();
}


  @Post()
  async create(@Body() body: CreateUserDto) {
    return this.usersService.create(body);
  }
}
