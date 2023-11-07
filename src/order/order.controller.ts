import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { Order } from '../models/order.model';
import { CreateOrderDto } from './dto/create-order.dto';
import { GetStatisticsDto } from './dto/get-statistics.dto';
import { OrderService } from './order.service';
import { GetOrderDto } from './dto/get-order.dto';
import { ApiCookieAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Order')
@Controller('order')

export class OrderController {
  constructor(private readonly OrderService: OrderService) { }

  @Get('statistics')
  @ApiCookieAuth()
  @UseGuards(JwtAuthGuard)
  async getStatistics(@Query() query: GetStatisticsDto) {
    return this.OrderService.getStatistics(query)
  }

  @Get(':uuid')
  @ApiCookieAuth()
  @UseGuards(JwtAuthGuard)
  async get(@Param('uuid') uuid: string) {
    return this.OrderService.get(uuid)
  }

  @Get()
  @ApiCookieAuth()
  @UseGuards(JwtAuthGuard)
  async getAll(@Query() query: GetOrderDto) {
    const params = {
      order: query.order || 'DESC',
      orderBy: query.orderBy || 'createdAt',
      limit: query.limit || '10000',
      offset: query.offset || '0',
    }

    return this.OrderService.getAll(params)
  }

  @Post()
  async create(@Body() Order: CreateOrderDto) {
    return this.OrderService.create(Order)
  }

  @Put(':uuid')
  @ApiCookieAuth()
  @UseGuards(JwtAuthGuard)
  async update(@Param('uuid') uuid: string, @Body() order: Partial<Order>) {
    return this.OrderService.update(uuid, order)
  }

  @Delete(':uuid')
  @ApiCookieAuth()
  @UseGuards(JwtAuthGuard)
  async delete(@Param('uuid') uuid: string) {
    return this.OrderService.delete(uuid)
  }
}

