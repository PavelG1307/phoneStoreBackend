import { Controller, Post, UseGuards, Get, Res, Req } from '@nestjs/common';
import { Response } from 'express'
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guard/jwt-auth.guard';
import { LocalAuthGuard } from './guard/local.auth.guard';
import { jwtConstants } from '../core/constants'
import { RollbarHandler } from 'nestjs-rollbar';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @RollbarHandler()
  @Post('login')
  async login(@Req() req, @Res({ passthrough: true }) response: Response) {
    const tokens = await this.authService.createTokens(req.user.uuid)
    response.cookie('_jwt1', tokens.accessToken, jwtConstants.accessTokenOptions)
    response.cookie('_jwt2', tokens.refreshToken, jwtConstants.refreshTokenOptions)
    return
  }

  @UseGuards(JwtAuthGuard)
  @RollbarHandler()
  @Post('logout')
  async logout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie('_jwt1')
    response.clearCookie('_jwt2')
    return
  }
}