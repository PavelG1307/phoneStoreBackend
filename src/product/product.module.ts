import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Order } from '../models/order.model';
import { Product } from '../models/product.model';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';

@Module({
    controllers: [ProductController],
    providers: [ProductService],
    imports: [SequelizeModule.forFeature([Product, Order])]})
export class ProductModule {}
