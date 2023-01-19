import { UUID, Variant } from "../../models/types"

export class CreateOrderDto {
    name: string
    price: number
    priceOld: number
    categoryUUID: UUID
    images: string[]
    description: string
    visible: boolean
    optionIds: number[]
    variants?: Variant[]
}