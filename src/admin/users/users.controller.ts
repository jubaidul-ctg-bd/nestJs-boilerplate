import {
    Body,
    Controller,
    Get,
    Param,
    Put,
    Query,
    UseGuards
} from '@nestjs/common'
import { FilterUserDto } from 'src/admin/users/dto/filter-user.dto'
import { PaginateDto } from '../../common/dto/paginate.dto'
import { SUCCESS } from '../../common/utils/response-message.util'
import { JwtAdminAuthGuard } from '../auth/guards/jwt-admin-auth.guard'
import { UpdateUserStatusDto } from './dto/update-user-status.dto'
import { UsersService } from './users.service'

@Controller({
    version: '1',
    path: 'api/admin/users'
})
export class UsersController {
    constructor(private readonly usersService: UsersService) {}
    @Get()
    @UseGuards(JwtAdminAuthGuard)
    async findAll(
        @Query() paginate: PaginateDto,
        @Query() filter: FilterUserDto
    ) {
        const userData = await this.usersService.findAll(paginate, filter)
        return {
            message: SUCCESS,
            result: userData
        }
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        const user = await this.usersService.findOne(id)
        return {
            message: SUCCESS,
            result: user
        }
    }

    @Put('update-status/:id')
    async update(
        @Param('id') id: string,
        @Body() updateUserDto: UpdateUserStatusDto
    ) {
        const result = await this.usersService.updateUserStatus(
            id,
            updateUserDto
        )
        return {
            status: SUCCESS,
            result: result
        }
    }
}
