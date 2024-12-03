import { Module } from '@nestjs/common'
import { AdminsModule } from './admins/admins.module'
import { AuthModule } from './auth/auth.module'
import { RolePermissionsModule } from './role-permissions/role-permissions.module'
import { UsersModule } from './users/users.module'

@Module({
    imports: [UsersModule, RolePermissionsModule, AdminsModule, AuthModule]
})
export class AdminModule {}
