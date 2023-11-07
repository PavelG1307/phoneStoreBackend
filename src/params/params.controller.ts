import { Body, Controller, Get, NotFoundException, Param, Patch, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { ParamService } from './params.service';
import { UpdateParamDto } from './dto/update-param.dto';
import { ApiCookieAuth, ApiTags } from '@nestjs/swagger';
import { GetParamResponseDto } from './dto/get-param.dto';
import { PARAM_NAMES } from './types';

@ApiTags('Param')
@ApiCookieAuth()
@Controller('param')
export class ParamController {
  constructor(private readonly paramService: ParamService) { }

  @Get(':name')
  @UseGuards(JwtAuthGuard)
  async getParam(@Param('name') name: PARAM_NAMES): Promise<GetParamResponseDto> {
    const param = await this.paramService.getOne(name)
    if (!param) {
      throw new NotFoundException('Param not found')
    }
    return param
  }

  @Patch(':name')
  @UseGuards(JwtAuthGuard)
  async updateParam(@Param('name') name: PARAM_NAMES, @Body() param: UpdateParamDto): Promise<GetParamResponseDto> {
    const { value } = param;
    const updatedParam = await this.paramService.update(name, value)
    if (!updatedParam) {
      throw new NotFoundException('Param not found')
    }
    return updatedParam
  }
}

