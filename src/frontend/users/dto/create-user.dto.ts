import { Type } from 'class-transformer'
import {
    IsArray,
    IsBoolean,
    IsEnum,
    IsMongoId,
    IsNotEmpty,
    IsNumber,
    IsObject,
    IsOptional,
    IsString,
    ValidateNested
} from 'class-validator'
import { Types } from 'mongoose'
import { Phone } from 'src/common/dto/phone.dto'
import {
    UserGenderEnum,
    UserStatus,
    UserType
} from 'src/repository/enums/user.enum'

export class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    firstName: string

    @IsString()
    @IsNotEmpty()
    lastName: string

    @IsString()
    @IsNotEmpty()
    email: string

    @IsString()
    @IsNotEmpty()
    password: string

    @IsNotEmpty()
    @IsObject()
    @ValidateNested() // This ensures that nested validation occurs on the Phone object
    @Type(() => Phone) // This ensures that the class-transformer properly handles Phone as a class
    phone: Phone

    @IsString()
    @IsOptional()
    username: string

    @IsNotEmpty()
    @IsString()
    gender: UserGenderEnum

    @IsNotEmpty()
    @IsEnum(UserType)
    userType: UserType

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
    lastEducation: string

    @IsOptional()
    @IsString()
    lastProfession: string

    @IsOptional()
    @IsString()
    lastDesignation: string

    @IsOptional()
    @IsString()
    lastOrganization: string

    @IsOptional()
    @IsArray()
    interestReasons: []

    @IsOptional()
    @IsString()
    dateOfBirth: Date

    @IsOptional()
    @IsString()
    address: string

    @IsOptional()
    @IsMongoId()
    city: Types.ObjectId

    @IsOptional()
    @IsMongoId()
    state: Types.ObjectId

    @IsOptional()
    @IsMongoId()
    country: Types.ObjectId

    @IsOptional()
    @IsNumber()
    zip: number

    memberKey: string
    memberCode: string
    status: UserStatus
}
