import { Controller, Get, Next, Res } from '@nestjs/common';
import { RollbarHandler } from 'nestjs-rollbar';
import { PrometheumService } from './prometheum.service';
import { Registry } from 'prom-client'

@Controller('metrics')

export class PrometheumController {
  private registry = new Registry()

  constructor(
      private readonly prometheumService: PrometheumService,
      ) {
      PrometheumService.activeUsersPerCategoryMetric(this.registry);
  }

  @Get()
  @RollbarHandler({ rethrow: true })
  async getStatistics(@Res() res, @Next() next) {
    res.set('Content-Type', this.registry.contentType);
    const metrics = await this.registry.metrics()
    res.end(metrics);
    
    next();
  }
}

