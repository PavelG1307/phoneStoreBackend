import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { RollbarHandler } from 'nestjs-rollbar';
import { Product } from '../models/product.model';
import { CreateProductDto } from './dto/create-product.dto';
import { GetProductDto } from './dto/get-product.dto';
import { ProductService } from './product.service';

@Controller('product')

export class ProductController {
  constructor(private readonly ProductService: ProductService) { }

  @Get(':uuid')
  @RollbarHandler()
  async get(@Param('uuid') uuid: string) {
    return this.ProductService.get(uuid)
  }

  @Get()
  @RollbarHandler()
  async getAll(@Query() filters: GetProductDto) {
    return this.ProductService.getAll(filters)
  }

  @Post()
  @RollbarHandler()
  async create(@Body() product: CreateProductDto) {
    return this.ProductService.create(product)
  }

  @Put(':uuid')
  @RollbarHandler()
  async update(@Param('uuid') uuid: string, @Body() product: Partial<Product>) {
    return this.ProductService.update(uuid, product)
  }

  @Delete(':uuid')
  @RollbarHandler()
  async delete(@Param('uuid') uuid: string) {
    return this.ProductService.delete(uuid)
  }
}

