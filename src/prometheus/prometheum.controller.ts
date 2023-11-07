import { Controller, Get, Next, Res } from '@nestjs/common';
import { PrometheumService } from './prometheum.service';
import { Registry } from 'prom-client'
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Metric')
@Controller('metrics')
export class PrometheumController {
  private registry = new Registry()

  constructor(
      private readonly prometheumService: PrometheumService,
      ) {
      PrometheumService.activeUsersPerCategoryMetric(this.registry);
  }

  @Get()
  async getStatistics(@Res() res, @Next() next) {
    res.set('Content-Type', this.registry.contentType);
    const metrics = await this.registry.metrics()
    res.end(metrics);
    
    next();
  }
}

