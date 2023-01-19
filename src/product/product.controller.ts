import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { Product } from '../models/product.model';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductService } from './product.service';

@Controller('product')

export class ProductController {
  constructor(private readonly ProductService: ProductService) { }

  @Get(':uuid')
  async get(@Param('uuid') uuid: string) {
    return this.ProductService.get(uuid)
  }

  @Get()
  async getAll() {
    return this.ProductService.getAll()
  }

  @Post()
  async create(@Body() product: CreateProductDto) {
    return this.ProductService.create(product)
  }

  @Put(':uuid')
  async update(@Param('uuid') uuid: string, @Body() product: Partial<Product>) {
    return this.ProductService.update(uuid, product)
  }

  @Delete(':uuid')
  async delete(@Param('uuid') uuid: string) {
    return this.ProductService.delete(uuid)
  }
}

