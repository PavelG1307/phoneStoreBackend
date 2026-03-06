import { ApiProperty } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer"
import { IsDate, IsNumber, IsOptional, IsString, Max, Min } from "class-validator"

export class CreatePromoCodeDto {
    @ApiProperty()
    @IsString()
    @Transform(({ value}) => {
        return value.replace(/^\s+|\s+$/g, '').toLowerCase();
    })
    name: string

    @ApiProperty()
    @IsNumber()
    @Min(1)
    discount: number

    @ApiProperty()
    @IsOptional()
    @IsDate()
    @Type(() => Date)
    existsUp: Date

    @ApiProperty()
    @IsOptional()
    @IsNumber()
    quantity?: number
}