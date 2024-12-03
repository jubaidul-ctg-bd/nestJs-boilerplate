import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto'
import { IsEnum, IsNotEmpty, IsString } from 'class-validator'
import { UserStatus } from 'src/repository/enums/user.enum';

export class UpdateUserStatusDto extends PartialType(CreateUserDto) {
    @IsNotEmpty()
    @IsString()
    @IsEnum(UserStatus)
    status : UserStatus
}
