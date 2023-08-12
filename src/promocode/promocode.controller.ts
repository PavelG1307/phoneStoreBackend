import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards, ValidationPipe } from '@nestjs/common';
import { RollbarHandler } from 'nestjs-rollbar';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { GetPromoCodeDto } from './dto/get-promocode.dto';
import { CreatePromoCodeDto } from './dto/create-promocode.dto';
import { PromoCodeService } from './promocode.service';
import { PromoCode } from 'src/models/promocode.model';

@Controller('promocode')
export class PromoCodeController {
  constructor(private readonly PromoCodeService: PromoCodeService) { }

  @Get()
  @RollbarHandler({ rethrow: true })
  async get(@Query(new ValidationPipe({ transform: true })) query: GetPromoCodeDto) {
    return this.PromoCodeService.get(query.name)
  }

  @Get('all')
  @UseGuards(JwtAuthGuard)
  @RollbarHandler({ rethrow: true })
  async getAll() {
    return this.PromoCodeService.getAll()
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @RollbarHandler({ rethrow: true })
  async create(@Body(new ValidationPipe({ transform: true })) promoCode: CreatePromoCodeDto) {
    return this.PromoCodeService.create(promoCode)
  }

  @Patch(':uuid')
  @UseGuards(JwtAuthGuard)
  @RollbarHandler({ rethrow: true })
  async update(@Param('uuid') uuid: string, @Body() promoCode: Partial<PromoCode>) {
    return this.PromoCodeService.update(uuid, promoCode)
  }

  @Delete(':uuid')
  @UseGuards(JwtAuthGuard)
  @RollbarHandler({ rethrow: true })
  async delete(@Param('uuid') uuid: string) {
    return this.PromoCodeService.delete(uuid)
  }
}

