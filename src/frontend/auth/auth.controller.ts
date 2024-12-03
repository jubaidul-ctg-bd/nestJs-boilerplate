import { Controller, Post, Request, UseGuards } from '@nestjs/common'
import { LOGGED_IN } from 'src/common/utils/response-message.util'
import { AuthService } from 'src/frontend/auth/auth.service'
import { LocalAuthGuard } from 'src/frontend/auth/guards/local-auth.guard'

@Controller({
    version: '1',
    path: 'api/auth'
})
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('login')
    @UseGuards(LocalAuthGuard)
    async login(@Request() req) {
        const authenticationData = await this.authService.login(req.user)
        return {
            message: LOGGED_IN,
            result: authenticationData
        }
    }
}
