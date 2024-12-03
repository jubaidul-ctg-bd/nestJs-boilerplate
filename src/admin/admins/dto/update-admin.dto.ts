import { PartialType } from '@nestjs/mapped-types'
import { IsEnum, IsOptional } from 'class-validator'
import { AdminStatusEnum } from 'src/repository/mongodb/schemas/admin.schema'
import { CreateAdminDto } from './create-admin.dto'

export class UpdateAdminDto extends PartialType(CreateAdminDto) {
    @IsEnum(AdminStatusEnum)
    @IsOptional()
    status: string
}
