import { Injectable, OnApplicationBootstrap } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { PaginateModel } from 'mongoose'
import {
    TempStorage,
    TempStorageDocument
} from 'src/repository/mongodb/schemas/tempStorage.schema'
import { IDataServices } from '../abstract/i-data-services.abstract'
import { MongoGenericRepository } from './mongo-generic-repository'
import { Admin, AdminDocument } from './schemas/admin.schema'

import { Permission, PermissionDocument } from './schemas/permission.schema'
import { Role, RoleDocument } from './schemas/role.schema'
import { User, UserDocument } from './schemas/user.schema'

@Injectable()
export class MongoDataServices
    implements IDataServices, OnApplicationBootstrap
{
    users: MongoGenericRepository<User>
    permissions: MongoGenericRepository<Permission>
    admins: MongoGenericRepository<Admin>
    roles: MongoGenericRepository<Role>
    tempStorage: MongoGenericRepository<TempStorage>

    constructor(
        @InjectModel(User.name)
        private UserRepository: PaginateModel<UserDocument>,
        @InjectModel(Permission.name)
        private PermissionRepository: PaginateModel<PermissionDocument>,
        @InjectModel(Admin.name)
        private AdminsRepository: PaginateModel<AdminDocument>,
        @InjectModel(Role.name)
        private RoleRepository: PaginateModel<RoleDocument>,
        @InjectModel(TempStorage.name)
        private TempStorageRepository: PaginateModel<TempStorageDocument>
    ) {}

    onApplicationBootstrap() {
        this.users = new MongoGenericRepository<User>(this.UserRepository, [])
        this.permissions = new MongoGenericRepository<Permission>(
            this.PermissionRepository,
            []
        )
        this.roles = new MongoGenericRepository<Role>(this.RoleRepository, [
            'permissions'
        ])
        this.admins = new MongoGenericRepository<Admin>(this.AdminsRepository, [
            'role'
        ])
        this.tempStorage = new MongoGenericRepository<TempStorage>(
            this.TempStorageRepository,
            []
        )
    }
}
