import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common'
import { AuthService } from './auth.service';
import { LocalAdminAuthGuard } from './guards/local-admin-auth.guard'
import { LOGGED_IN } from '../../common/utils/response-message.util'

@Controller({
  version : '1',
  path : 'api/admin/auth/'
})
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @UseGuards(LocalAdminAuthGuard)
  async login(@Request() req) {
    const authenticationData = await this.authService.login(req.user);
    return {
      message: LOGGED_IN,
      result: authenticationData
    }
  }

}
