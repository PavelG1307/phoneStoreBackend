import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { CategoryModule } from 'src/category/category.module';
import { UserModule } from 'src/user/user.module';
import { PrometheumModule } from 'src/prometheus/prometheum.module';
import { Order } from '../models/order.model';
import { Product } from '../models/product.model';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';

@Module({
    controllers: [ProductController],
    providers: [ProductService],
    imports: [
        SequelizeModule.forFeature([Product, Order]),
        CategoryModule,
        UserModule,
        PrometheumModule,
    ]})
export class ProductModule {}
