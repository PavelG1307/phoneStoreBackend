import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards, ValidationPipe } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { Product } from '../models/product.model';
import { CreateProductDto } from './dto/create-product.dto';
import { GetProductDto } from './dto/get-product.dto';
import { ProductService } from './product.service';
import { ApiCookieAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Product')
@Controller('product')
export class ProductController {
  constructor(private readonly ProductService: ProductService) { }

  @Get(':uuid')
  async get(@Param('uuid') uuid: string) {
    return this.ProductService.get(uuid)
  }

  @Get()
  async getAll(@Query(new ValidationPipe({ transform: true })) filters: GetProductDto) {
    return this.ProductService.getAll(filters)
  }

  @Post()
  @ApiCookieAuth()
  @UseGuards(JwtAuthGuard)
  async create(@Body() product: CreateProductDto) {
    return this.ProductService.create(product)
  }

  @Put(':uuid')
  @ApiCookieAuth()
  @UseGuards(JwtAuthGuard)
  async update(@Param('uuid') uuid: string, @Body() product: Partial<Product>) {
    return this.ProductService.update(uuid, product)
  }

  @Delete(':uuid')
  @ApiCookieAuth()
  @UseGuards(JwtAuthGuard)
  async delete(@Param('uuid') uuid: string) {
    return this.ProductService.delete(uuid)
  }
}

