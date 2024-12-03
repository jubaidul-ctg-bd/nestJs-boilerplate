import { Injectable, UnauthorizedException } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { Strategy } from 'passport-local'
import { AuthService } from '../auth.service'

@Injectable()
export class LocalAdminStrategy extends PassportStrategy(
    Strategy,
    'local-admin'
) {
    constructor(private readonly authService: AuthService) {
        super({ usernameField: 'email' })
    }

    async validate(email: string, password: string): Promise<any> {
        const admin = await this.authService.validateUser(email, password)
        if (!admin) {
            throw new UnauthorizedException('Invalid email or password')
        }
        return admin
    }
}
