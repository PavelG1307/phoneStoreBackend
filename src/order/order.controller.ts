import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { Order } from '../models/Order.model';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderService } from './order.service';

@Controller('order')

export class OrderController {
  constructor(private readonly OrderService: OrderService) { }

  @Get(':uuid')
  async get(@Param('uuid') uuid: string) {
    return this.OrderService.get(uuid)
  }

  @Get()
  async getAll() {
    return this.OrderService.getAll()
  }

  @Post()
  async create(@Body() Order: CreateOrderDto) {
    return this.OrderService.create(Order)
  }

  @Put(':uuid')
  async update(@Param('uuid') uuid: string, @Body() Order: Partial<Order>) {
    return this.OrderService.update(uuid, Order)
  }
}

