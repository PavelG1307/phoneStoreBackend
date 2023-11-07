import { INestApplication } from '@nestjs/common'
import {
  SwaggerModule,
  DocumentBuilder,
  SwaggerDocumentOptions,
} from '@nestjs/swagger'

export const initSwagger = (app: INestApplication) => {
  const config = new DocumentBuilder()
    .setTitle('RK Tech API')
    .setVersion('1.0.0')
    .setDescription('Тут могло быть описание, но мне лень')
    .addTag('Auth')
    .addTag('Product')
    .addTag('Order')
    .addTag('User')
    .addTag('Metric')
    .addTag('Category')
    .addTag('Promocode')
    .addTag('Storage')
    .addCookieAuth('_jwt1')
    .build()

    // const options = new DocumentBuilder().addSecurity('basic', {
    //   type: 'http',
    //   scheme: 'basic',
    // });
  const options: SwaggerDocumentOptions = {
    operationIdFactory: (_, methodKey) => methodKey,
  }

  const document = SwaggerModule.createDocument(app, config, options)
  SwaggerModule.setup(process.env.API_PREFIX + '/docs', app, document)
}
