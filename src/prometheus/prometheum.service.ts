import { Injectable } from "@nestjs/common"
import * as client from 'prom-client'
import { CategoryService } from 'src/category/category.service';

@Injectable()
export class PrometheumService {

    private static categoriesWithDistribution = new Map<string, number>;
    private static categoriesUuidToName = new Map(CategoryService.categories.map(category => [category.uuid, category.name]));
    private static categoriesNames = CategoryService.categories.map(category => category.name)

    public static activeUsersPerCategoryMetric(registry) {
        const gauge = new client.Gauge({
            name: 'active_users',
            help: 'Amount of active users right now per category',
            registers: [registry],
            labelNames: [
                'category',
            ],
        });

        async function collectActiveUsers() {
            for (const category of PrometheumService.categoriesNames){
                let value = 0
                if (PrometheumService.categoriesWithDistribution.has(category)) {
                    value = PrometheumService.categoriesWithDistribution.get(category)
                }
                gauge.set({ category }, value);
            }
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
}