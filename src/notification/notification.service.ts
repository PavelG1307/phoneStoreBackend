import { Injectable } from '@nestjs/common'
import { NotificationProvider, NotificationType } from './types'
import { InjectModel } from '@nestjs/sequelize';
import { Param } from 'src/models/param.model';
import { QueueService } from 'src/queue/queue.service';
import { PrometheumService } from 'src/prometheus/prometheum.service';
@Injectable()
export class NotificationService {
    constructor(
        @InjectModel(Param)
        private readonly ParamModel: typeof Param,
        private readonly queueService: QueueService
    ) {}

    public static NotificationProviders: { [name: string]: NotificationProvider } = {
        TELEGRAM: {
            name: 'TELEGRAM',
            queueName: 'telegram'
        },
    }

    public static NotificationTypes: { [type: string]: NotificationType } = {
        CREATED_ORDER: {
            id: 1,
            name: 'Новый заказ',
            providers: [NotificationService.NotificationProviders.TELEGRAM]
        },
        UPDATED_ORDER: {
            id: 2,
            name: 'Изменен заказ',
            providers: [NotificationService.NotificationProviders.TELEGRAM]
        },
        DELETED_ORDER: {
            id: 1,
            name: 'Удален заказ',
            providers: [NotificationService.NotificationProviders.TELEGRAM]
        },
    }

    public static DeliveryVariants = [
        {
          name: 'Самовывоз из офиса г. Москва',
          id: 1,
        },
        {
          name: 'Доставка по Москве внутри МКАД',
          id: 2,
        },
        {
          name: 'Доставка СДЭК в регионы',
          id: 3,
        },
        {
          name: 'Самовывоз из магазина г. Рязань',
          id: 4,
        },
    ];

    public async notify(notificationTypeId: number, data: any) {
        const messageData = await this.getDataForNotification(notificationTypeId, data)
        if (!messageData.telegramChatId) {
            console.error('TelegramChatId not found')
            return
        }

        PrometheumService.incNotificationMetric('Telegram')
        this.queueService.send(messageData, NotificationService.NotificationProviders.TELEGRAM.queueName)
    }

    private async getDataForNotification(notificationTypeId: number, data: any){
        let message = ''
        let telegramChatId = ''
        switch (notificationTypeId) {
            case NotificationService.NotificationTypes.CREATED_ORDER.id:
                message = this.getMessageForCreatedProduct(data);
                telegramChatId = await this.getTelegramChatId();
                return { message, telegramChatId }
                break;
            case NotificationService.NotificationTypes.UPDATED_ORDER.id:
                break;
            case NotificationService.NotificationTypes.DELETED_ORDER.id:
                break;
        }
        return { message, telegramChatId }
    }

    private getMessageForCreatedProduct(data: any): string {
        const { fullName, phoneNumber, delivery, deliveryMessage, email, comment } = data
        const productNames = data.items.map((item) => {
            const tagsData = !item.tags || item.tags.length === 0 ? ' ' : ` (${item.tags.join(', ')})`
            return `${item.name}${tagsData} - ${item.price} рублей`
        }).join('\n')

        const deliveryVariant = NotificationService.DeliveryVariants.find(v => v.id === delivery)
        const deliveryName = deliveryVariant ? deliveryVariant.name : 'неизвестно'
        return `**Новый заказ!**\nФИО: ${fullName}\nНомер телефона: ${phoneNumber}\nEmail: ${email || '-'}\n\nТовары:\n${productNames}\n\nСпособ доставки: ${deliveryName}\nИнформация о доставке: ${deliveryMessage || '-'}\nКомментарий к заказу: ${comment || '-'}`
    }

    private async getTelegramChatId(): Promise<string> {
        const param = await Param.findOne({ where: { name: Param.ParamNames.TELEGRAM_CHAT_ID }})
        if (!param) return null
        return param.value
    }
}