import { Body, Controller, Delete, Get, NotFoundException, Param, Patch, Post, Put, Query, UseGuards } from '@nestjs/common';
import { RollbarHandler } from 'nestjs-rollbar';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { ParamService } from './params.service';
import { NotFoundError } from 'rxjs';
import { UpdateParamDto } from './dto/update-param.dto';

@Controller('order')

export class ParamController {
  constructor(private readonly paramService: ParamService) { }

  @Get(':name')
  @UseGuards(JwtAuthGuard)
  @RollbarHandler({ rethrow: true })
  async getParam(@Param('name') name: string) {
    const param = await this.paramService.getOne(name)
    if (!param) {
      throw new NotFoundException('Param not found')
    }
    return param
  }

  @Patch(':name')
  @UseGuards(JwtAuthGuard)
  @RollbarHandler({ rethrow: true })
  async updateParam(@Param('name') name: string, @Body() param: UpdateParamDto) {
    const { value } = param;
    const updatedParam = await this.paramService.update(name, value)
    if (!updatedParam) {
      throw new NotFoundException('Param not found')
    }
    return updatedParam
  }
}

