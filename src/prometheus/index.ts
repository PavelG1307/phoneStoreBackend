import * as client from 'prom-client'
import { CategoryService } from 'src/category/category.service';

export class PrometheumService {

    private static categoriesWithDistribution = new Map<string, number>;

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
            const categoriesNames = CategoryService.categories.map(category => category.name)
            
            for (const category of categoriesNames){
                let value = 0
                if (PrometheumService.categoriesWithDistribution.has(category)) {
                    value = PrometheumService.categoriesWithDistribution.get(category)
                }
                gauge.set({ category }, value);
            }
          }
          
          setInterval(collectActiveUsers, 5000);
    }

    public static incUsersPerCategoryMetric(categoryName: string) {
        if (!PrometheumService.categoriesWithDistribution.has(categoryName)) {
            PrometheumService.categoriesWithDistribution.set(categoryName, 1)
            return
        }
        const prevValue = PrometheumService.categoriesWithDistribution.get(categoryName)
        PrometheumService.categoriesWithDistribution.set(categoryName, prevValue + 1)
        
    }
}