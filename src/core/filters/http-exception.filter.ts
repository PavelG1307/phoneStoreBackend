import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common'
import { Request, Response } from 'express'

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name)

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()
    const request = ctx.getRequest<Request>()

    const isDev = process.env.NODE_ENV === 'dev'
    const isHttpException = exception instanceof HttpException
    const status = isHttpException
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR
    const message = isHttpException
      ? exception.message
      : exception instanceof Error
        ? exception.message
        : 'Internal server error'

    const getMessage = () => {
      if (!isHttpException) return message
      const res = exception.getResponse()
      if (typeof res === 'object' && res !== null && 'message' in res) return (res as { message: string }).message
      if (typeof res === 'string') return res
      return message
    }

    const body: Record<string, unknown> = {
      statusCode: status,
      message: getMessage(),
    }

    if (isDev && !isHttpException && exception instanceof Error) {
      body.error = message
      body.stack = exception.stack
    }

    if (!isHttpException && exception instanceof Error) {
      this.logger.error(`${request.method} ${request.url} ${message}`, exception.stack)
    }

    response.status(status).json(body)
  }
}
