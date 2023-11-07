import { Body, Controller, Get, Request, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { Roles } from 'src/auth/guard/roles-auth.decorator';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { UserService } from './user.service';
import { ApiCookieAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('User')
@ApiCookieAuth()
@Controller('user')
export class UserController {
  constructor(private readonly UserService: UserService) { }

  @Get()
  @UseGuards(JwtAuthGuard)
  getProfile(@Request() req) {
    return req.user;
  }

  @Post()
  @Roles('ADMIN')
  @UseGuards(JwtAuthGuard, RolesGuard)
  async create(@Body() user: CreateUserDto) {
    return this.UserService.create(user)
  }
}

