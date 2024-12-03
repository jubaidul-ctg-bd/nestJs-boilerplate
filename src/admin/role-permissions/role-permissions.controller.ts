import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put,
    UseGuards
} from '@nestjs/common'
import {
    CREATED,
    DELETED,
    SUCCESS
} from '../../common/utils/response-message.util'
import { JwtAdminAuthGuard } from '../auth/guards/jwt-admin-auth.guard'
import { CreatePermissionDto } from './dto/create-permission.dto'
import { CreateRoleDto } from './dto/create-role.dto'
import { UpdatePermissionDto } from './dto/update-permission.dto'
import { UpdateRoleStatusDto } from './dto/update-role-status.dto'
import { RolePermissionsService } from './role-permissions.service'

@Controller({
    version: '1',
    path: 'api/admin/role'
})
export class RolePermissionsController {
    constructor(
        private readonly rolePermissionsService: RolePermissionsService
    ) {}

    @Post('/create-role')
    @UseGuards(JwtAdminAuthGuard)
    async createRole(@Body() createRoleDto: CreateRoleDto) {
        const result =
            await this.rolePermissionsService.createRole(createRoleDto)
        return {
            status: CREATED,
            result: result
        }
    }

    @Get('/get-roles')
    async findAllRoles() {
        const roles = await this.rolePermissionsService.findAllRoles()
        return {
            status: SUCCESS,
            result: roles
        }
    }

    @Get('/get-role/:id')
    async findOneRole(@Param('id') id: string) {
        const role = await this.rolePermissionsService.findOneRole(id)
        return {
            status: SUCCESS,
            result: role
        }
    }

    @Put('/update-role/:id')
    async updateRoleStatus(
        @Param('id') id: string,
        @Body() updateRoleStatusDto: UpdateRoleStatusDto
    ) {
        const result = await this.rolePermissionsService.updateRoleStatus(
            id,
            updateRoleStatusDto
        )
        return {
            status: SUCCESS,
            result: result
        }
    }

    @Delete('/delete-role/:id')
    async removeRole(@Param('id') id: string) {
        const result = await this.rolePermissionsService.removeRole(id)
        return {
            status: SUCCESS
        }
    }

    @Post('create-permission')
    @UseGuards(JwtAdminAuthGuard)
    async createPermission(@Body() createPermissionDto: CreatePermissionDto) {
        const result =
            await this.rolePermissionsService.createPermission(
                createPermissionDto
            )
        return {
            status: CREATED,
            result: result
        }
    }

    @Get('/get-permissions')
    @UseGuards(JwtAdminAuthGuard)
    async findAllPermissions() {
        const permissions =
            await this.rolePermissionsService.findAllPermissions()
        return {
            status: SUCCESS,
            result: permissions
        }
    }

    @Get('/get-permission/:id')
    @UseGuards(JwtAdminAuthGuard)
    async findOnePermission(@Param('id') id: string) {
        const permission =
            await this.rolePermissionsService.findOnePermission(id)
        return {
            status: SUCCESS,
            result: permission
        }
    }

    @Put('/update-permission/:id')
    @UseGuards(JwtAdminAuthGuard)
    async updatePermission(
        @Param('id') id: string,
        @Body() updatePermissionDto: UpdatePermissionDto
    ) {
        const result = await this.rolePermissionsService.updatePermission(
            id,
            updatePermissionDto
        )
        return {
            status: SUCCESS,
            result: result
        }
    }

    @Delete('/delete-permission/:id')
    @UseGuards(JwtAdminAuthGuard)
    async removePermission(@Param('id') id: string) {
        const result = await this.rolePermissionsService.removePermission(id)
        return {
            status: DELETED,
            result: result
        }
    }
}
