import { UUID, Variant } from "../../models/types"

export class CreateProductDto {
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