import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { RollbarHandler } from 'nestjs-rollbar';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { Order } from '../models/order.model';
import { CreateOrderDto } from './dto/create-order.dto';
import { GetStatisticsDto } from './dto/get-statistics.dto';
import { OrderService } from './order.service';

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
  async getAll() {
    return this.OrderService.getAll()
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

