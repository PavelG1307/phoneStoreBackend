import { ApiProperty } from "@nestjs/swagger";
import { PARAM_NAMES } from "../types";

export class GetParamResponseDto {
    @ApiProperty({
        enum: PARAM_NAMES
    })
    name: string;

    @ApiProperty({
        example: 'you can write any text here',
        required: true,
    })
    value: string;
}