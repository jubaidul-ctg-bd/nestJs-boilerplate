import { Injectable, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { AuthService } from 'src/admin/auth/auth.service'

@Injectable()
export class JwtAdminStrategy extends PassportStrategy(Strategy, 'jwt-admin') {
    constructor(
        private readonly configService: ConfigService,
        private readonly authService: AuthService
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get('jwtSecret')
        })
    }

    async validate(payload: any) {
        const admin = await this.authService.getUser(payload.sub)
        if (!admin) {
            throw new UnauthorizedException('Invalid user')
        }
        return {
            userId: admin._id,
            permissions: admin?.role?.permissions
        }
    }
}
