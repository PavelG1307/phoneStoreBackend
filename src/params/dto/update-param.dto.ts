import { ApiProperty } from "@nestjs/swagger";

export class UpdateParamDto {
    @ApiProperty()
    value: string
}