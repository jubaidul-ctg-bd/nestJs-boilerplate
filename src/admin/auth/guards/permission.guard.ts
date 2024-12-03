import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Reflector } from '@nestjs/core'
import { Observable } from 'rxjs'
import { Permission } from 'src/admin/auth/enums/permission.enum'

@Injectable()
export class PermissionsGuard implements CanActivate {
    constructor(
        private readonly configService: ConfigService,
        private reflector: Reflector
    ) {}

    canActivate(
        context: ExecutionContext
    ): boolean | Promise<boolean> | Observable<boolean> {
        const requiredPermissions = this.reflector.getAllAndOverride<
            Permission[]
        >('permissions', [context.getHandler(), context.getClass()])

        const { user } = context.switchToHttp().getRequest()
        if (!requiredPermissions) {
            return true
        }

        if (!user?.permissions?.length) {
            return false
        }

        return requiredPermissions.every((permission) =>
            user.permissions.some((p) => p.slug == permission)
        )
    }
}
