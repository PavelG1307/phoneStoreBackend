import { Body, Controller, Get, Request, Post, UseGuards } from '@nestjs/common';
import { RollbarHandler } from 'nestjs-rollbar';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { Roles } from 'src/auth/guard/roles-auth.decorator';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { UserService } from './user.service';

@Controller('user')

export class UserController {
  constructor(private readonly UserService: UserService) { }

  @UseGuards(JwtAuthGuard)
  @RollbarHandler()
  @Get()
  getProfile(@Request() req) {
    return req.user;
  }

  @Roles('ADMIN')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @RollbarHandler()
  @Post()
  async create(@Body() user: CreateUserDto) {
    return this.UserService.create(user)
  }
}

