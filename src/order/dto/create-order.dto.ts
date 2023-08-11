import { OrderItem } from "src/models/orderItem.model"
import { UUID } from "src/models/types"

export class CreateOrderDto {
    fullName: string
    phoneNumber: string
    items: OrderItem[]
    communicationMethod: number
    delivery: number
    deliveryMessage?: string
    promoCodeUUID?: UUID
}