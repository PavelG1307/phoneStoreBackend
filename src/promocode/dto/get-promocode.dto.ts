import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsArray, IsString } from "class-validator"

export class GetPromoCodeDto {

  @ApiProperty()
  @IsString()
  @Transform(({ value}) => {
    return value.replace(/^\s+|\s+$/g, '').toLowerCase();
  })
  name?: string

  @ApiProperty()
  @IsArray()
  categoryUUIDs: string[]
}

export class PromoCodeFilter {
  categoryUUIDs: string[]
}
