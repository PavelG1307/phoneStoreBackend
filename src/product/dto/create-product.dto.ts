import { UUID } from "../../models/types"

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
    priceDependOnColor?: boolean
}

class Variant {
    id: number
    isDefault?: boolean
    optionIds: number[]
    optionInfo: VariantOptionInfo
}

class VariantOptionInfo {
    name?: string
    price?: number
    priceOld?: number
    images?: string[]
    description?: string
}