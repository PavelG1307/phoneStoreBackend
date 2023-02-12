import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards, ValidationPipe } from '@nestjs/common';
import { RollbarHandler } from 'nestjs-rollbar';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { Product } from '../models/product.model';
import { CreateProductDto } from './dto/create-product.dto';
import { GetProductDto } from './dto/get-product.dto';
import { ProductService } from './product.service';

@Controller('product')
export class ProductController {
  constructor(private readonly ProductService: ProductService) { }

  @Get(':uuid')
  @RollbarHandler({ rethrow: true })
  async get(@Param('uuid') uuid: string) {
    return this.ProductService.get(uuid)
  }

  @Get()
  @RollbarHandler({ rethrow: true })
  async getAll(@Query(new ValidationPipe({ transform: true })) filters: GetProductDto) {
    return this.ProductService.getAll(filters)
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @RollbarHandler({ rethrow: true })
  async create(@Body() product: CreateProductDto) {
    return this.ProductService.create(product)
  }

  @Post('/migrate')
  async migrate() {
    return this.ProductService.migrate()
  }

  @Put(':uuid')
  @UseGuards(JwtAuthGuard)
  @RollbarHandler({ rethrow: true })
  async update(@Param('uuid') uuid: string, @Body() product: Partial<Product>) {
    return this.ProductService.update(uuid, product)
  }

  @Delete(':uuid')
  @UseGuards(JwtAuthGuard)
  @RollbarHandler({ rethrow: true })
  async delete(@Param('uuid') uuid: string) {
    return this.ProductService.delete(uuid)
  }
}

