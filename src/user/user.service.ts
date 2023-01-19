import { HttpException, HttpStatus, Injectable } from "@nestjs/common"
import { InjectModel } from "@nestjs/sequelize"
import { createHash } from "crypto"
import { User } from "src/models/user.model"
import { CreateUserDto } from "./dto/create-user.dto"

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User)
    private readonly userModel: typeof User,
  ) {}

  async get(uuid: string) {
    const user = User.findAll({ where: {
      uuid
    }})
    return user
  }

  async getOne(login: string) {
    const user = await User.findOne({ where: {
      login
    }})
    return user?.dataValues
  }

  async create(user: CreateUserDto) {
    const isAllowLogin = await this.checkAllowLogin(user.login)
    if (!isAllowLogin) throw new HttpException('Bad request', HttpStatus.BAD_REQUEST)
    const passwordHash = createHash('md5').update(user.password).digest('hex');
    const newUser = await User.create({ passwordHash, ...user }, {
      returning: true
    })
    delete newUser.passwordHash
    return newUser
  }

  async checkAllowLogin(login: string) {
    const user = await User.findOne({where: { login }})
    return !user
  }

  async update(uuid: string, shop: User) {
    return User.update(shop, {
      where: { uuid },
      returning: true
    })
  }
}
