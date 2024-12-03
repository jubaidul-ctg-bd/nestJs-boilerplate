import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    Put,
    Query,
    Request,
    UploadedFile,
    UseGuards,
    UseInterceptors
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { PaginateDto } from 'src/common/dto/paginate.dto'
import {
    DELETED,
    EMAIL_SENT,
    PASSWORD_CHANGED,
    REGISTERED,
    RESET_PASSWORD,
    SUCCESS,
    UPDATED,
    UPLOADED,
    VALIDATED
} from 'src/common/utils/response-message.util'
import { JwtAuthGuard } from 'src/frontend/auth/guards/jwt-auth.guard'
import { ChangePasswordDto } from 'src/frontend/users/dto/change-password.dto'
import { ForgotPasswordDto } from 'src/frontend/users/dto/forgot-password.dto'
import { ResetPasswordDto } from 'src/frontend/users/dto/reset-password.dto'
import { UpdateUserDto } from 'src/frontend/users/dto/update-user.dto'
import { CreateUserDto } from './dto/create-user.dto'
import { UsersService } from './users.service'

@Controller({
    version: '1',
    path: 'api/users'
})
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Post()
    async create(@Body() createUserDto: CreateUserDto) {
        const userData = await this.usersService.create(createUserDto)

        return {
            message: REGISTERED,
            result: userData
        }
    }

    @Get('profile')
    @UseGuards(JwtAuthGuard)
    async getProfile(@Request() req) {
        const userData = await this.usersService.findOne(req.user.userId)
        return {
            message: SUCCESS,
            result: userData
        }
    }

    @Get()
    @UseGuards(JwtAuthGuard)
    async findAll(@Query() paginate: PaginateDto) {
        const userData = await this.usersService.findAll(paginate)
        return {
            message: SUCCESS,
            result: userData
        }
    }

    @Put()
    @UseGuards(JwtAuthGuard)
    async update(@Request() req, @Body() updateUserDto: UpdateUserDto) {
        const userData = await this.usersService.update(
            req.user.userId,
            updateUserDto
        )

        return {
            message: UPDATED,
            result: userData
        }
    }

    @Patch('complete-account')
    async completeAccount(
        @Query('token') token: string,
        @Body() updateUserDto: UpdateUserDto
    ) {
        const userData = await this.usersService.completeAccount(
            token,
            updateUserDto
        )

        return {
            message: UPDATED,
            result: userData
        }
    }

    @Put('change-password')
    @UseGuards(JwtAuthGuard)
    async changePassword(
        @Request() req,
        @Body() changePasswordDto: ChangePasswordDto
    ) {
        const userData = await this.usersService.changePassword(
            req.user.userId,
            changePasswordDto
        )

        return {
            message: PASSWORD_CHANGED,
            result: userData
        }
    }

    @Put('profile-image')
    @UseInterceptors(FileInterceptor('file'))
    @UseGuards(JwtAuthGuard)
    async uploadProfileImage(@Request() req, @UploadedFile() file) {
        const userData = await this.usersService.uploadProfileImage(
            req.user.userId,
            file
        )

        return {
            message: UPLOADED,
            result: userData
        }
    }

    @Post('forgot-password')
    async forgotPassword(
        @Request() req,
        @Body() forgotPasswordDto: ForgotPasswordDto
    ) {
        const userData =
            await this.usersService.forgotPassword(forgotPasswordDto)

        return {
            message: EMAIL_SENT,
            result: userData
        }
    }

    @Post('reset-password')
    async resetPassword(
        @Request() req,
        @Body() resetPasswordDto: ResetPasswordDto
    ) {
        const userData = await this.usersService.resetPassword(resetPasswordDto)

        return {
            message: RESET_PASSWORD,
            result: userData
        }
    }

    @Get('validate-reset-link')
    async validateResetLink(@Query('token') token: string) {
        const isValid = await this.usersService.validateResetToken(token)
        return {
            message: VALIDATED,
            result: isValid
        }
    }

    @Get('email-validation')
    async emailValidation(@Query('token') token: string) {
        const isValid = await this.usersService.emailValidation(token)
        return {
            message: VALIDATED,
            result: isValid
        }
    }

    @Get('complete-account-link-validation')
    async completeAccountLinkValidation(@Query('token') token: string) {
        const isValid =
            await this.usersService.completeAccountLinkValidation(token)
        return {
            message: VALIDATED,
            result: isValid
        }
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    remove(@Param('id') id: string) {
        const userData = this.usersService.remove(id)
        return {
            message: DELETED,
            result: userData
        }
    }
}
