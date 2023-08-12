import { IsEmail, IsOptional } from "class-validator"
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
    paymentTypeId?: number

    @IsOptional()
    @IsEmail()
    email?: string

    payerTypeId?: number
    comment?: string
}
