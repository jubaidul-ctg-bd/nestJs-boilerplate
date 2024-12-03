import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import * as argon2 from 'argon2'
import { IDataServices } from '../../repository/abstract/i-data-services.abstract'
import { AdminStatusEnum } from '../../repository/mongodb/schemas/admin.schema'
import { AdminsService } from '../admins/admins.service'

@Injectable()
export class AuthService {
    constructor(
        private readonly adminsService: AdminsService,
        private jwtService: JwtService,
        private readonly dataServices: IDataServices
    ) {}

    async validateUser(email: string, password: string): Promise<any> {
        const admin = await this.dataServices.admins.findOne(
            { email: email, status: AdminStatusEnum.ACTIVE },
            '+password'
        )

        if (admin && (await argon2.verify(admin.password, password))) {
            delete admin.password
            return admin
        }

        return null
    }

    async getUser(id: string): Promise<any> {
        return await this.dataServices.admins.findOnePopulate({
            _id: id,
            status: AdminStatusEnum.ACTIVE
        })
    }

    async login(admin: any) {
        const payload = { sub: admin._id }
        return {
            accessToken: this.jwtService.sign(payload)
        }
    }
}
