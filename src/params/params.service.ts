import { Injectable } from "@nestjs/common"
import { InjectModel } from "@nestjs/sequelize"
import { Param } from "src/models/param.model"
import { GetParamResponseDto } from "./dto/get-param.dto"

@Injectable()
export class ParamService {
  constructor(
    @InjectModel(Param)
    private readonly ParamModel: typeof Param
  ) {}

  public async getOne(name: string): Promise<GetParamResponseDto> {
    const param = await Param.findOne({ where: { name } })
    if (!param) {
      return null
    }

    return {
      name: param.name,
      value: param.value
    }
  }

  public async update(name: string, value: string): Promise<GetParamResponseDto> {
    await Param.update({ value }, { where: { name } })
    return this.getOne(name)
  }
}
