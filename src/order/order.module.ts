import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { OrderItem } from 'src/models/orderItem.model';
import { Product } from 'src/models/product.model';
import { UserModule } from 'src/user/user.module';
import { Order } from '../models/order.model';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { PromoCode } from 'src/models/promocode.model';
import { PromoCodeModule } from 'src/promocode/promocode.module';
import { NotificaionModule } from 'src/notification/notification.module';
import { PromoCodeCategory } from 'src/models/promocodeCategory.model';

@Module({
    controllers: [OrderController],
    providers: [OrderService],
    imports: [
        SequelizeModule.forFeature([Product, Order, OrderItem, PromoCode, PromoCodeCategory]),
        UserModule,
        PromoCodeModule,
        NotificaionModule
    ]})
export class OrderModule {}
