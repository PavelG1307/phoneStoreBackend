import { Transform } from "class-transformer";
import { IsString } from "class-validator"

export class GetPromoCodeDto {

  @IsString()
  @Transform(({ value}) => {
    return value.replace(/^\s+|\s+$/g, '').toLowerCase();
  })
  name?: string
}
