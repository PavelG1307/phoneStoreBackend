import * as compression from 'compression'
import helmet from 'helmet'
import { NestFactory } from '@nestjs/core'
import { ValidationPipe } from '@nestjs/common'
import { AppModule } from './app.module'
import { corsOptions } from './core/config/cors'
import { initSwagger } from './core/lib/swagger'
import { EXIT_CODES } from './core/constants'

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule)
    app.useGlobalPipes(new ValidationPipe())
    app.enableCors(corsOptions)
    app.setGlobalPrefix(process.env.API_PREFIX)

    app.use(compression())
    app.use(helmet())

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
