import { Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import * as JWT from 'jsonwebtoken';
import { createHash } from 'crypto'

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
  ) { }

  async validateUser(login: string, password: string): Promise<any> {
    if (!password || !login) return null
    const user = await this.userService.getOne(login);    
    const passwordHash = createHash('md5').update(password).digest('hex');
    if (user && user.passwordHash === passwordHash) {
      const { passwordHash, ...result } = user;
      return result;
    }
    return null
  }

  async createTokens(userUUID: string) {
    const accessToken = JWT.sign(userUUID, process.env.SECRET_JWT_KEY)
    const refreshToken = JWT.sign(userUUID, process.env.SECRET_REFRESH_JWT_KEY)
    return { accessToken, refreshToken }
  }
}
