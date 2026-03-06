import { Product } from "./product.model"

export type UUID = string
export class Option {
    id: number
    name?: string
    values: string
    type?: string
}

export class OptionList {
    name: string
    items: Option[]
}

export type Variant = {
    id: number,
    isDefault?: boolean,
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