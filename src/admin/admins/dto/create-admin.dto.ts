import { Type } from 'class-transformer'
import {
    IsEmail,
    IsEnum,
    IsNotEmpty,
    IsObject,
    IsOptional,
    IsString,
    ValidateNested
} from 'class-validator'
import { Types } from 'mongoose'
import { Phone } from 'src/common/dto/phone.dto'
import { AdminTypeEnum } from 'src/repository/mongodb/schemas/admin.schema'

export class CreateAdminDto {
    @IsString()
    @IsNotEmpty()
    firstName: string

    @IsString()
    @IsNotEmpty()
    lastName: string

    @IsOptional()
    @IsNotEmpty()
    username: string

    @IsEmail()
    @IsNotEmpty()
    email: string

    @IsString()
    @IsNotEmpty()
    password: string

    @IsOptional()
    role: Types.ObjectId

    @IsString()
    @IsOptional()
    department: string

    @IsString()
    @IsOptional()
    designation: string

    @IsOptional()
    @IsString()
    @IsEnum(AdminTypeEnum)
    adminType: AdminTypeEnum

    @IsOptional()
    @IsObject()
    @ValidateNested()
    @Type(() => Phone)
    phone: Phone
}
