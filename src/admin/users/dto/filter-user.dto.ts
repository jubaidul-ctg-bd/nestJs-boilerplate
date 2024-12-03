import { IsEnum, IsOptional, IsString } from 'class-validator'
import { UserStatus } from 'src/repository/enums/user.enum'

export class FilterUserDto {
    @IsOptional()
    @IsString()
    search: string

    @IsOptional()
    @IsString()
    @IsEnum(UserStatus)
    status: string
}
