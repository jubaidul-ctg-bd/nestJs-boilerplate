import { Global, Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import {
    TempStorage,
    TempStorageSchema
} from 'src/repository/mongodb/schemas/tempStorage.schema'
import { DbManagerModule } from '../../config/db-manager/db-manager.module'
import { IDataServices } from '../abstract/i-data-services.abstract'
import { MongoDataServices } from './mongo-data-services'
import { Admin, AdminSchema } from './schemas/admin.schema'
import { Permission, PermissionSchema } from './schemas/permission.schema'
import { Role, RoleSchema } from './schemas/role.schema'
import { User, UserSchema } from './schemas/user.schema'
@Global()
@Module({
    imports: [
        DbManagerModule,
        MongooseModule.forFeature([
            { name: User.name, schema: UserSchema },
            { name: Permission.name, schema: PermissionSchema },
            { name: Role.name, schema: RoleSchema },
            { name: Admin.name, schema: AdminSchema },
            { name: TempStorage.name, schema: TempStorageSchema }
        ])
    ],
    providers: [
        {
            provide: IDataServices,
            useClass: MongoDataServices
        }
    ],
    exports: [IDataServices]
})
export class MongodbModule {}
