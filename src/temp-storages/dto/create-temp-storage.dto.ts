import { IsNotEmpty, IsString } from 'class-validator'

export class CreateTempStorageDto {
    @IsString()
    @IsNotEmpty()
    key: string

    @IsNotEmpty()
    value: any

    @IsNotEmpty()
    @IsString()
    ttl: string
}
