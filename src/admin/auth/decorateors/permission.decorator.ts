import { SetMetadata } from '@nestjs/common'
import { Permission } from 'src/admin/auth/enums/permission.enum'

export const Permissions = (...permissions: Permission[]) =>
    SetMetadata('permissions', permissions)
