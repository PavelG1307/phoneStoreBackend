import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards, ValidationPipe } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { Product } from '../models/product.model';
import { CreateProductDto } from './dto/create-product.dto';
import { GetProductDto, GetProductsResponseItemDto } from './dto/get-product.dto';
import { ProductService } from './product.service';
import { ApiBody, ApiCookieAuth, ApiOkResponse, ApiParam, ApiTags } from '@nestjs/swagger';
import { UpdateProductDto } from './dto/update-product.dto';

@ApiTags('Product')
@Controller('product')
export class ProductController {
  constructor(private readonly ProductService: ProductService) { }

  @Get(':uuid')
  @ApiParam({ name: 'uuid', description: 'UUID товара', format: "uuid", type: "string" })
  async get(@Param('uuid') uuid: string): Promise<GetProductsResponseItemDto> {
    return this.ProductService.get(uuid)
  }

  @Get()
  async getAll(@Query(new ValidationPipe({ transform: true })) filters: GetProductDto): Promise<GetProductsResponseItemDto[]> {
    return this.ProductService.getAll(filters)
  }

  @Post()
  @ApiCookieAuth()
  @UseGuards(JwtAuthGuard)
  async create(@Body() product: CreateProductDto): Promise<GetProductsResponseItemDto> {
    return this.ProductService.create(product)
  }

  @Put(':uuid')
  @ApiCookieAuth()
  @ApiParam({ name: 'uuid', description: 'UUID товара', format: "uuid", type: "string", })
  @ApiBody({ type: UpdateProductDto })
  @UseGuards(JwtAuthGuard)
  async update(@Param('uuid') uuid: string, @Body() product: UpdateProductDto): Promise<GetProductsResponseItemDto> {
    return this.ProductService.update(uuid, product)
  }

  @Delete(':uuid')
  @ApiCookieAuth()
  @ApiParam({ name: 'uuid', description: 'UUID товара', format: "uuid", type: "string" })
  @UseGuards(JwtAuthGuard)
  async delete(@Param('uuid') uuid: string) {
    return this.ProductService.delete(uuid)
  }
}

