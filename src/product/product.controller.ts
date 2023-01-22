import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { RollbarHandler } from 'nestjs-rollbar';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { Product } from '../models/product.model';
import { CreateProductDto } from './dto/create-product.dto';
import { GetProductDto } from './dto/get-product.dto';
import { ProductService } from './product.service';

@Controller('product')

export class ProductController {
  constructor(private readonly ProductService: ProductService) { }

  @RollbarHandler()
  @Get(':uuid')
  async get(@Param('uuid') uuid: string) {
    return this.ProductService.get(uuid)
  }

  @RollbarHandler()
  @Get()
  async getAll(@Query() filters: GetProductDto) {
    return this.ProductService.getAll(filters)
  }

  @UseGuards(JwtAuthGuard)
  @RollbarHandler()
  @Post()
  async create(@Body() product: CreateProductDto) {
    return this.ProductService.create(product)
  }

  @UseGuards(JwtAuthGuard)
  @RollbarHandler()
  @Put(':uuid')
  async update(@Param('uuid') uuid: string, @Body() product: Partial<Product>) {
    return this.ProductService.update(uuid, product)
  }

  @UseGuards(JwtAuthGuard)
  @RollbarHandler()
  @Delete(':uuid')
  async delete(@Param('uuid') uuid: string) {
    return this.ProductService.delete(uuid)
  }
}

