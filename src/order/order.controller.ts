import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { RollbarHandler } from 'nestjs-rollbar';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { Order } from '../models/order.model';
import { CreateOrderDto } from './dto/create-order.dto';
import { GetStatisticsDto } from './dto/get-statistics.dto';
import { OrderService } from './order.service';
import { GetOrderDto } from './dto/get-order.dto';

@Controller('order')

export class OrderController {
  constructor(private readonly OrderService: OrderService) { }

  @Get('statistics')
  @UseGuards(JwtAuthGuard)
  @RollbarHandler({ rethrow: true })
  async getStatistics(@Query() query: GetStatisticsDto) {
    return this.OrderService.getStatistics(query)
  }

  @Get(':uuid')
  @RollbarHandler({ rethrow: true })
  async get(@Param('uuid') uuid: string) {
    return this.OrderService.get(uuid)
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @RollbarHandler({ rethrow: true })
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
  @RollbarHandler({ rethrow: true })
  async create(@Body() Order: CreateOrderDto) {
    return this.OrderService.create(Order)
  }

  @Put(':uuid')
  @UseGuards(JwtAuthGuard)
  @RollbarHandler({ rethrow: true })
  async update(@Param('uuid') uuid: string, @Body() order: Partial<Order>) {
    return this.OrderService.update(uuid, order)
  }

  @Delete(':uuid')
  @UseGuards(JwtAuthGuard)
  @RollbarHandler({ rethrow: true })
  async delete(@Param('uuid') uuid: string) {
    return this.OrderService.delete(uuid)
  }
}

