import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards, ValidationPipe } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { GetPromoCodeDto } from './dto/get-promocode.dto';
import { CreatePromoCodeDto } from './dto/create-promocode.dto';
import { PromoCodeService } from './promocode.service';
import { PromoCode } from 'src/models/promocode.model';
import { ApiCookieAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Promocode')
@Controller('promocode')
export class PromoCodeController {
  constructor(private readonly PromoCodeService: PromoCodeService) { }

  @Get()
  async get(@Query(new ValidationPipe({ transform: true })) query: GetPromoCodeDto) {
    return this.PromoCodeService.get(query.name)
  }

  @Get('all')
  @ApiCookieAuth()
  @UseGuards(JwtAuthGuard)
  async getAll() {
    return this.PromoCodeService.getAll()
  }

  @Post()
  @ApiCookieAuth()
  @UseGuards(JwtAuthGuard)
  async create(@Body(new ValidationPipe({ transform: true })) promoCode: CreatePromoCodeDto) {
    return this.PromoCodeService.create(promoCode)
  }

  @Put(':uuid')
  @ApiCookieAuth()
  @UseGuards(JwtAuthGuard)
  async update(@Param('uuid') uuid: string, @Body() promoCode: Partial<PromoCode>) {
    return this.PromoCodeService.update(uuid, promoCode)
  }

  @Delete(':uuid')
  @ApiCookieAuth()
  @UseGuards(JwtAuthGuard)
  async delete(@Param('uuid') uuid: string) {
    return this.PromoCodeService.delete(uuid)
  }
}

