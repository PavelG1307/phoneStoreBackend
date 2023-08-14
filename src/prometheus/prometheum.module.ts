import { Module } from '@nestjs/common';
import { PrometheumController } from './prometheum.controller';
import { PrometheumService } from './prometheum.service';
import { Registry } from 'prom-client';

@Module({
    controllers: [PrometheumController],
    providers: [PrometheumService],
    imports: [],
    exports: [
        PrometheumService
    ]})
export class PrometheumModule {}
