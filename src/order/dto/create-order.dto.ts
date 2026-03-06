import { ApiProperty } from "@nestjs/swagger"
import { IsEmail, IsOptional } from "class-validator"
import { OrderItem } from "src/models/orderItem.model"
import { UUID } from "src/models/types"

export class CreateOrderDto {
    @ApiProperty()
    fullName: string

    @ApiProperty()
    phoneNumber: string

    @ApiProperty()
    items: OrderItem[]

    @ApiProperty()
    communicationMethod: number

    @ApiProperty()
    delivery: number

    @ApiProperty()
    deliveryMessage?: string

    @ApiProperty()
    promoCodeUUID?: UUID

    @ApiProperty()
    paymentTypeId?: number

    @ApiProperty()
    @IsOptional()
    @IsEmail()
    email?: string

    @ApiProperty()
    payerTypeId?: number

    @ApiProperty()
    comment?: string
}
