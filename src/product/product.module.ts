import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { StorageModule } from 'src/storage/storage.module';
import { UserModule } from 'src/user/user.module';
import { Order } from '../models/order.model';
import { Product } from '../models/product.model';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';

@Module({
    controllers: [ProductController],
    providers: [ProductService],
    imports: [
        SequelizeModule.forFeature([Product, Order]),
        UserModule,
        StorageModule
    ]})
export class ProductModule {}
