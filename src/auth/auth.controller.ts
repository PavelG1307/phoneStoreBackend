import { Controller, Post, UseGuards, Res, Req } from '@nestjs/common';
import { Response } from 'express'
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guard/jwt-auth.guard';
import { LocalAuthGuard } from './guard/local.auth.guard';
import { cookieConstants } from '../core/constants'
import { ApiBody, ApiCookieAuth, ApiTags } from '@nestjs/swagger';
import { LoginDto } from './dto/auth.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
  ) {}

  @Post('login')
  @ApiBody({ type: LoginDto })
  @UseGuards(LocalAuthGuard)
  async login(@Req() req, @Res({ passthrough: true }) response: Response) {
    const tokens = await this.authService.createTokens(req.user.uuid)
    response.cookie('_jwt1', tokens.accessToken, cookieConstants.accessTokenOptions)
    response.cookie('_jwt2', tokens.refreshToken, cookieConstants.refreshTokenOptions)
    return { accessToken: tokens.accessToken }
  }

  @Post('logout')
  @ApiCookieAuth()
  @UseGuards(JwtAuthGuard)
  async logout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie('jwt1')
    response.clearCookie('jwt2')
    return
  }
}