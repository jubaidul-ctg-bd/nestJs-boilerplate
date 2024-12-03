import { PartialType } from '@nestjs/mapped-types'
import { IsOptional, IsString } from 'class-validator'
import { RoleStatusEnum } from '../../../repository/mongodb/schemas/role.schema'
import { CreateRoleDto } from './create-role.dto'

export class UpdateRoleStatusDto extends PartialType(CreateRoleDto) {
    @IsString()
    @IsOptional()
    status: RoleStatusEnum
}
