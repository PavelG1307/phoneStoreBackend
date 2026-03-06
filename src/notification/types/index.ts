export type NotificationType = {
    id: number;
    name: string;
    providers: [NotificationProvider];
}

export type NotificationProvider = {
    name: string;
    queueName: string;
}
