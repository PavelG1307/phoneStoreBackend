import { Transform, Type } from "class-transformer"
import { IsArray, IsEnum, IsOptional, IsString } from "class-validator"
import { UUID } from "src/models/types"

export class GetProductDto {
  
  @IsOptional()
  limit?: string

  @IsOptional()
  offset?: string

  @IsOptional()
  @IsEnum(['price', 'createdAt'])
  orderBy?: 'price' | 'createdAt'

  @IsOptional()
  @IsEnum(['DESC', 'ASC'])
  order?: 'DESC' | 'ASC'

  @IsOptional()
  readonly categoryUUID?: UUID

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Type(() => String)
  @Transform(({ value }) => value.split(','))
  readonly productUUIDs?: string[]
}
