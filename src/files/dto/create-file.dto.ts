import { IsNumber, IsString } from 'class-validator'

export class CreateFileDto {
    @IsString()
    fieldname: string

    @IsString()
    originalname: string

    @IsString()
    encoding: string

    @IsString()
    mimetype: string

    buffer: Buffer

    @IsNumber()
    size: number
}
