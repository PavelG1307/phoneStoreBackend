import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Order } from 'src/models/order.model';
import { Product } from 'src/models/product.model';
import { Value } from 'src/models/value.model';
import { Variant } from 'src/models/variant.model';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';

@Module({
    controllers: [ProductController],
    providers: [ProductService],
    imports: [SequelizeModule.forFeature([Product, Option, Value, Variant, Order])]})
export class ProductModule {}
