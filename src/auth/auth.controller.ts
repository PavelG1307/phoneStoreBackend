import { Controller, Post, UseGuards, Get, Res, Req } from '@nestjs/common';
import { Response } from 'express'
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guard/jwt-auth.guard';
import { LocalAuthGuard } from './guard/local.auth.guard';
import { jwtConstants } from '../core/constants'
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private jwtService: JwtService
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Req() req, @Res({ passthrough: true }) response: Response) {
    const access_token = this.jwtService.sign(req.user, { privateKey: process.env.SECRET_JWT_KEY })
    response.cookie('_jwt1', access_token, {
      httpOnly: true,
      maxAge: jwtConstants.maxAge,
      path: '/',
    })
    return
  }

  @Get('refresh')
  async refresh(@Req() req) {
    return this.authService.login(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  getProfile(@Req() req) {
    return req.user;
  }
}