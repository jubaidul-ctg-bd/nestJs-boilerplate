import { PartialType } from '@nestjs/mapped-types'
import { CreatePermissionDto } from './create-permission.dto'
import { IsNotEmpty, IsString } from 'class-validator'

export class UpdatePermissionDto extends PartialType(CreatePermissionDto) {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    slug: string
}