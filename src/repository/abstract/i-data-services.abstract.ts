import { TempStorage } from 'src/repository/mongodb/schemas/tempStorage.schema'
import { Admin } from '../mongodb/schemas/admin.schema'

import { Permission } from '../mongodb/schemas/permission.schema'
import { Role } from '../mongodb/schemas/role.schema'
import { User } from '../mongodb/schemas/user.schema'
import { IGenericRepository } from './i-generic-repository.abstract'

export abstract class IDataServices {
    abstract users: IGenericRepository<User>
    abstract permissions: IGenericRepository<Permission>
    abstract roles: IGenericRepository<Role>
    abstract admins: IGenericRepository<Admin>
    abstract tempStorage: IGenericRepository<TempStorage>
}
