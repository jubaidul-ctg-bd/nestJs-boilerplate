import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport'
import { JwtModule } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import { AdminsModule } from '../admins/admins.module'
import { LocalAdminStrategy } from './strategies/local-admin.strategy'
import { JwtAdminStrategy } from './strategies/jwt-admin.strategy'

@Module({
  controllers: [AuthController],
  imports: [
    AdminsModule,
    PassportModule,
    JwtModule.registerAsync({
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('jwtSecret'),
        signOptions: { expiresIn: configService.get('jwtValidTime') }
      }),
      inject: [ConfigService]
    })
  ],
  providers: [AuthService, LocalAdminStrategy, JwtAdminStrategy],
  exports: [AuthService]
})
export class AuthModule {}
