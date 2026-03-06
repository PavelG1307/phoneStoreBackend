import {  Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { QueueModule } from 'src/queue/queue.module';
import { Param } from 'src/models/param.model';
import { SequelizeModule } from '@nestjs/sequelize';

@Module({
    imports: [
        SequelizeModule.forFeature([Param]),
        QueueModule, 
    ],
    providers: [NotificationService],
    exports: [NotificationService]
})

export class NotificaionModule {}