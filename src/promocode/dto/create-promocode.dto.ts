import { Transform, Type } from "class-transformer"
import { IsDate, IsNumber, IsOptional, IsString, Max, Min } from "class-validator"

export class CreatePromoCodeDto {
    @IsString()
    @Transform(({ value}) => {
        return value.replace(/^\s+|\s+$/g, '').toLowerCase();
    })
    name: string

    @IsNumber()
    @Min(1)
    discount: number

    @IsOptional()
    @IsDate()
    @Type(() => Date)
    existsUp: Date

    @IsOptional()
    @IsNumber()
    quantity?: number
}