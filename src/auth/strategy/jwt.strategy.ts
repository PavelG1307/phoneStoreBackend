import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, ExtractJwt } from 'passport-jwt';
import { cookieOrHeaderExtractor } from "src/core/utils";
import { User } from "src/models/user.model";
import { UserService } from "src/user/user.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly userService: UserService
  ) {
    super({
      jwtFromRequest: cookieOrHeaderExtractor,
      ignoreExpiration: false,
      secretOrKey: process.env.SECRET_JWT_KEY,
    });
  }

  async validate(userUUID): Promise<User> {
    const user = await this.userService.get(userUUID);
    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}