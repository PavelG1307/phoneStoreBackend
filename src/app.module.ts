import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { SequelizeModule } from '@nestjs/sequelize';
import { getEnvFilePath } from './core/utils'
import { Product } from './models/product.model';
import { Variant } from './models/variant.model';
import { Option } from './models/option.model';
import { Value } from './models/value.model';
import { Order } from './models/order.model';

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
      models: [Product, Option, Variant, Value, Order],
      autoLoadModels: true,
      logging: process.env.NODE_ENV === 'dev' ? console.log : false
    })
  ],
  controllers: []
})
export class AppModule {}
