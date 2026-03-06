import { Transform } from "class-transformer"
import { IsEnum, IsOptional, IsString } from "class-validator"
import { UUID } from "src/models/types"

export class GetProductDto {
  
  @IsOptional()
  limit?: string

  @IsOptional()
  offset?: string

  @IsOptional()
  @IsEnum(['price', 'createdAt', 'releaseAt', 'sortValue'])
  orderBy?: 'price' | 'createdAt' | 'releaseAt' | 'sortValue'

  @IsOptional()
  @IsEnum(['DESC', 'ASC'])
  order?: 'DESC' | 'ASC'

  @IsOptional()
  readonly categoryUUID?: UUID

  @IsOptional()
  @Transform((params) => {
    try {
      return params.value.split(',')
    } catch {
      return params?.value
    }
  }
  )
  @IsString({ each: true })
  readonly productUUIDs?: string[]
}

export class GetProductsResponseItemDto {
  uuid: string
  name: string
  price: number
  priceOld?: number
  categoryUUID: UUID
  images?: string[]
  description?: string
  visible?: boolean
  options?: OptionList[]
  variants?: Variant[]
  priceDependOnColor?: boolean
  isDeleted?: boolean
  createdAt?: Date
  updatedAt?: Date
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