import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { AuthController } from 'src/frontend/auth/auth.controller'
import { JwtStrategy } from 'src/frontend/auth/strategies/jwt.strategy'
import { UsersModule } from '../users/users.module'
import { AuthService } from './auth.service'
import { LocalStrategy } from './strategies/local.strategy'

@Module({
    controllers: [AuthController],
    imports: [
        UsersModule,
        PassportModule,
        JwtModule.registerAsync({
            useFactory: async (configService: ConfigService) => ({
                secret: configService.get('jwtSecret'),
                signOptions: { expiresIn: configService.get('jwtValidTime') }
            }),
            inject: [ConfigService]
        })
    ],
    providers: [AuthService, LocalStrategy, JwtStrategy],
    exports: [AuthService]
})
export class AuthModule {}
