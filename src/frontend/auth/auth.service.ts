import { Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import * as argon2 from 'argon2'
import { IDataServices } from 'src/repository/abstract/i-data-services.abstract'
import { UserStatus } from 'src/repository/enums/user.enum'
import { UsersService } from '../users/users.service'

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
        private readonly dataServices: IDataServices
    ) {}

    async validateUser(email: string, password: string): Promise<any> {
        const user = await this.dataServices.users.findOne(
            { email: email },
            '+password'
        )
        if (user.status !== UserStatus.ACTIVE) {
            throw new UnauthorizedException('User is not active')
        }

        if (user && (await argon2.verify(user.password, password))) {
            return user
        }
        return null
    }

    async login(user: any) {
        const payload = { sub: user._id, club: user.club }
        return {
            accessToken: this.jwtService.sign(payload)
        }
    }
}
