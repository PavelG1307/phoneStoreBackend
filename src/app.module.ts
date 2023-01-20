import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { SequelizeModule } from '@nestjs/sequelize';
import { getEnvFilePath } from './core/utils'
import { Product } from './models/product.model';
import { Order } from './models/order.model';
import { ProductModule } from './product/product.module';
import { User } from './models/user.model';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { Category } from './models/category.model';
import { CategoryModule } from './category/category.module';
import { OrderItem } from './models/orderItem.model';
import { OrderModule } from './order/order.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: getEnvFilePath()
    }),
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      models: [Product, Order, User, Category, OrderItem],
      autoLoadModels: true,
      synchronize: true,
      logging: process.env.NODE_ENV === 'dev' ? console.log : false
    }),
    ProductModule,
    UserModule,
    AuthModule,
    CategoryModule,
    OrderModule
  ]
})
export class AppModule {}
