import { Type } from 'class-transformer'
import {
    IsArray,
    IsMongoId,
    IsNotEmpty,
    IsString,
    ValidateNested
} from 'class-validator'
import { Types } from 'mongoose'

export class RolePermission {
    @IsMongoId()
    @IsNotEmpty()
    permission: Types.ObjectId

    @IsString()
    @IsNotEmpty()
    slug: string
}

export class CreateRoleDto {
    @IsString()
    @IsNotEmpty()
    name: string

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => RolePermission)
    permissions: RolePermission[]
}
