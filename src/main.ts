import * as compression from 'compression'
import helmet from 'helmet'
import { NestFactory } from '@nestjs/core'
import { ValidationPipe } from '@nestjs/common'
import { AppModule } from './app.module'
import { corsOptions } from './core/config/cors'
import { initSwagger } from './core/lib/swagger'
import { EXIT_CODES } from './core/constants'
import * as cookieParser from 'cookie-parser';
import { PrometheumMiddleware } from './prometheus/prometheum.middlewares'
import { QueueService } from './queue/queue.service'

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule)
    app.useGlobalPipes(
      new ValidationPipe({
        forbidUnknownValues: false
      }),
    )
    app.enableCors(corsOptions)
    app.setGlobalPrefix(process.env.API_PREFIX, { exclude: ['metrics'] })
    app.use(cookieParser());
    app.use(compression())
    app.use(helmet())
    app.use(PrometheumMiddleware)

    initSwagger(app)
    console.log('Started')
    await app.listen(process.env.PORT || 3000)
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(`Error occured: ${error.message}`)
    process.exit(EXIT_CODES.FAILED)
  }
}

bootstrap()
