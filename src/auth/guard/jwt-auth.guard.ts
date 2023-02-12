import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserService } from 'src/user/user.service';
import { AuthService } from '../auth.service';
import { ExtractJwt } from 'passport-jwt';
import { cookieOrHeaderExtractor } from 'src/core/utils';
import { cookieConstants } from 'src/core/constants';
import * as JWT from 'jsonwebtoken';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {

  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();

    try {
      const accessToken = ExtractJwt.fromExtractors([cookieOrHeaderExtractor])(request);
      
      if (!accessToken)
        throw new UnauthorizedException('Access token is not set');

      const isValidAccessToken = await this.validateToken(accessToken);      
      if (isValidAccessToken) return this.activate(context);

      const refreshToken = request.cookies['jwt2'];
      if (!refreshToken)
        throw new UnauthorizedException('Refresh token is not set');
      const isValidRefreshToken = await this.validateToken(refreshToken);
      if (!isValidRefreshToken)
        throw new UnauthorizedException('Refresh token is not valid');

      const user = await this.userService.getByRefreshToken(refreshToken);
      const {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      } = await this.authService.createTokens(user.uuid);

      await this.userService.updateRefreshToken(user.uuid, newRefreshToken);

      request.cookies['jwt1'] = newAccessToken;
      request.cookies['jwt2'] = newRefreshToken;

      response.cookie('_jwt1', newAccessToken, cookieConstants.accessTokenOptions);
      response.cookie('_jwt2', newRefreshToken, cookieConstants.refreshTokenOptions);

      return this.activate(context);
    } catch (err) {
      console.log(err)
      response.clearCookie('_jwt1', cookieConstants.accessTokenOptions);
      response.clearCookie('_jwt2', cookieConstants.refreshTokenOptions);
      return false;
    }
  }

  async activate(context: ExecutionContext): Promise<boolean> {
    return super.canActivate(context) as Promise<boolean>;
  }

  handleRequest(err, user) {
    if (err || !user) {
      throw new UnauthorizedException();
    }

    return user;
  }

  async validateToken(token: string): Promise<any> {
    return JWT.verify(token, process.env.SECRET_JWT_KEY)
  }
}
