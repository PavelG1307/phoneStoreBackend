import { UUID } from "src/models/types"

export class UpdateProductDto {
  name?: string
  price?: number
  priceOld?: number
  categoryUUID?: UUID
  images?: string[]
  description?: string
  visible?: boolean
  options?: OptionList[]
  variants?: Variant[]
  priceDependOnColor?: boolean
}

class Option {
  id: number
  name?: string
  values: string
  type?: string
}

class OptionList {
  name: string
  items: Option[]
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