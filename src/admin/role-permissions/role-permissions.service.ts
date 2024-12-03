import { Injectable } from '@nestjs/common'
import { convertToSlug } from 'src/common/helpers/case-conversion.helper'
import { IDataServices } from '../../repository/abstract/i-data-services.abstract'
import { RoleStatusEnum } from '../../repository/mongodb/schemas/role.schema'
import { CreatePermissionDto } from './dto/create-permission.dto'
import { CreateRoleDto } from './dto/create-role.dto'
import { UpdatePermissionDto } from './dto/update-permission.dto'
import { UpdateRoleStatusDto } from './dto/update-role-status.dto'

@Injectable()
export class RolePermissionsService {
    constructor(private readonly dataServices: IDataServices) {}

    async createRole(createRoleDto: CreateRoleDto) {
        const slug = convertToSlug(createRoleDto.name)
        return await this.dataServices.roles.create({
            ...createRoleDto,
            status: RoleStatusEnum.ACTIVE,
            slug
        })
    }

    async findAllRoles() {
        return await this.dataServices.roles.findAll()
    }

    async findOneRole(id: string) {
        return this.dataServices.roles.findOne({
            _id: id
        })
    }

    async updateRoleStatus(
        id: string,
        updateRoleStatusDto: UpdateRoleStatusDto
    ) {
        return await this.dataServices.roles.findOneAndUpdate(
            {
                _id: id
            },
            updateRoleStatusDto
        )
    }

    async removeRole(id: string) {
        return this.dataServices.roles.deleteOne({
            _id: id
        })
    }

    async createPermission(createPermissionDto: CreatePermissionDto) {
        const slug = convertToSlug(createPermissionDto.name)
        return await this.dataServices.permissions.create({
            ...createPermissionDto,
            slug
        })
    }

    async findAllPermissions() {
        return await this.dataServices.permissions.findAll({})
    }

    async findOnePermission(id: string) {
        return await this.dataServices.permissions.findOne({ _id: id })
    }

    async updatePermission(
        id: string,
        updatePermissionDto: UpdatePermissionDto
    ) {
        return await this.dataServices.permissions.findOneAndUpdate(
            {
                _id: id
            },
            updatePermissionDto
        )
    }

    async removePermission(id: string) {
        await this.dataServices.permissions.deleteOne({
            _id: id
        })
        return {}
    }
}
