import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { OrderItem } from 'src/models/orderItem.model';
import { Product } from 'src/models/product.model';
import { UserModule } from 'src/user/user.module';
import { Order } from '../models/order.model';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';

@Module({
    controllers: [OrderController],
    providers: [OrderService],
    imports: [
        SequelizeModule.forFeature([Product, Order, OrderItem]),
        UserModule
    ]})
export class OrderModule {}
