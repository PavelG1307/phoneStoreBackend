import { ApiProperty } from "@nestjs/swagger"

export class LoginDto {
    @ApiProperty({ required: true })
    login: string

    @ApiProperty({ required: true })
    password: string
}