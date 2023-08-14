import { Injectable } from "@nestjs/common"
import * as client from 'prom-client'
import { CategoryService } from 'src/category/category.service';

@Injectable()
export class PrometheumService {

    private static categoriesWithDistribution = new Map<string, number>;
    private static categoriesUuidToName = new Map(CategoryService.categories.map(category => [category.uuid, category.name]));
    private static categoriesNames = CategoryService.categories.map(category => category.name)

    private static PromCounterStatusCodes = new Map<number, number>;
    private static PromCounterErrors = 0;

    public static activeUsersPerCategoryMetric(registry) {
        const gaugeUsers = new client.Gauge({
            name: 'active_users',
            help: 'Amount of active users right now per category',
            registers: [registry],
            labelNames: [
                'category'
            ],
        });

        const gaugeRequest= new client.Gauge({
          name: 'requests',
          help: 'Amount of requests',
          registers: [registry],
          labelNames: [
              'statusCode',
              'error'
          ],
      });

        async function collectActiveUsers() {
            for (const category of PrometheumService.categoriesNames){
                let value = 0
                if (PrometheumService.categoriesWithDistribution.has(category)) {
                    value = PrometheumService.categoriesWithDistribution.get(category)
                }
                gaugeUsers.set({ category }, value);
            }

            for (const statusCode of PrometheumService.PromCounterStatusCodes.keys()){
              const value = PrometheumService.PromCounterStatusCodes.get(statusCode)
              gaugeRequest.set({ statusCode }, value);
            }

            gaugeRequest.set({ error: 'error' }, PrometheumService.PromCounterErrors);
          }
          
          setInterval(collectActiveUsers, 5000);
    }

    public static incUsersPerCategoryMetric(categoryUuid: string) {
        const categoryName = this.categoriesUuidToName.get(categoryUuid)
        if (!PrometheumService.categoriesWithDistribution.has(categoryName)) {
            PrometheumService.categoriesWithDistribution.set(categoryName, 1)
            return
        }
        const prevValue = PrometheumService.categoriesWithDistribution.get(categoryName)
        PrometheumService.categoriesWithDistribution.set(categoryName, prevValue + 1) 
    }

    public static incStatusCodeMetric(statusCode: number) {
      if (!PrometheumService.PromCounterStatusCodes.has(statusCode)) {
          PrometheumService.PromCounterStatusCodes.set(statusCode, 1)
          return
      }
      const prevValue = PrometheumService.PromCounterStatusCodes.get(statusCode)
      PrometheumService.PromCounterStatusCodes.set(statusCode, prevValue + 1)
      
  }

  public static incErrorMetric() {
    PrometheumService.PromCounterErrors++
  }
}