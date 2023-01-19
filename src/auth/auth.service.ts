import { Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { createHash } from 'crypto'

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService
    ) {}

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

  async login(user: any) {
    return {
      access_token: this.jwtService.sign(user, { privateKey: process.env.SECRET_JWT_KEY }),
    };
  }
}