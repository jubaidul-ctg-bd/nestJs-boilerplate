import { Type } from 'class-transformer'
import {
    IsBoolean,
    IsEnum,
    IsNotEmpty,
    IsNumber,
    IsObject,
    IsOptional,
    IsString,
    ValidateNested
} from 'class-validator'
import { Phone } from 'src/common/dto/phone.dto'
import { UserGenderEnum } from 'src/repository/enums/user.enum'

export class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    name: string

    @IsString()
    @IsNotEmpty()
    email: string

    @IsString()
    @IsNotEmpty()
    password: string

    @IsString()
    @IsOptional()
    username: string

    @IsString()
    @IsOptional()
    displayName: string

    @IsBoolean()
    @IsOptional()
    isOnline: boolean

    @IsString()
    @IsOptional()
    fcmToken: string

    @IsOptional()
    @IsString()
    profilePhoto: string

    @IsOptional()
    @IsString()
    dateOfBirth: Date

    @IsNotEmpty()
    @IsObject()
    @ValidateNested() // This ensures that nested validation occurs on the Phone object
    @Type(() => Phone) // This ensures that the class-transformer properly handles Phone as a class
    phone: Phone

    @IsEnum(UserGenderEnum)
    gender: UserGenderEnum

    @IsOptional()
    @IsString()
    address: string

    @IsOptional()
    @IsString()
    city: string

    @IsOptional()
    @IsString()
    state: string

    @IsOptional()
    @IsString()
    country: string

    @IsOptional()
    @IsNumber()
    zip: number
}
