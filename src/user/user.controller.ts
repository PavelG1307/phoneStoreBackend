import { Body, Controller, Get, Request, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { UserService } from './user.service';

@Controller('user')

export class UserController {
  constructor(private readonly UserService: UserService) { }

  @Get()
  @UseGuards(JwtAuthGuard)
  getProfile(@Request() req) {
    return req.user;
  }

  @Post()
  async create(@Body() user: CreateUserDto) {
    return this.UserService.create(user)
  }
}

