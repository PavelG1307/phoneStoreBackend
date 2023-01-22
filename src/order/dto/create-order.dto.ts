import { OrderItem } from "src/models/orderItem.model"

export class CreateOrderDto {
    fullName: string
    phoneNumber: string
    items: OrderItem[]
    communicationMethod: number
    delivery: number
    deliveryMessage?: string
}