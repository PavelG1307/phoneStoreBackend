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
