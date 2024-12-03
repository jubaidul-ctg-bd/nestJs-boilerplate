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
import { ChangePasswordDto } from 'src/admin/admins/dto/change-password.dto'
import { ForgotPasswordDto } from 'src/admin/admins/dto/forgot-password.dto'
import { ResetPasswordDto } from 'src/admin/admins/dto/reset-password.dto'
import { Permissions } from 'src/admin/auth/decorateors/permission.decorator'
import { Permission } from 'src/admin/auth/enums/permission.enum'
import { PermissionsGuard } from 'src/admin/auth/guards/permission.guard'
import { PaginateDto } from 'src/common/dto/paginate.dto'
import {
    CREATED,
    DATA_RETRIEVED,
    DELETED,
    EMAIL_SENT,
    PASSWORD_CHANGED,
    RESET_PASSWORD,
    SUCCESS,
    UPDATED,
    UPLOADED,
    VALIDATED
} from '../../common/utils/response-message.util'
import { JwtAdminAuthGuard } from '../auth/guards/jwt-admin-auth.guard'
import { AdminsService } from './admins.service'
import { CreateAdminDto } from './dto/create-admin.dto'
import { UpdateAdminDto } from './dto/update-admin.dto'

@Controller({
    path: 'api/admin/admins',
    version: '1'
})
export class AdminsController {
    constructor(private readonly adminsService: AdminsService) {}
    @Post()
    @Permissions(Permission.CREATE_ADMIN)
    @UseGuards(JwtAdminAuthGuard, PermissionsGuard)
    async create(@Body() createAdminDto: CreateAdminDto) {
        const result = await this.adminsService.create(createAdminDto)
        return {
            message: CREATED,
            result: result
        }
    }

    @Get()
    @Permissions(Permission.ADMIN_LIST)
    @UseGuards(JwtAdminAuthGuard, PermissionsGuard)
    async findAll(@Query() paginate: PaginateDto) {
        const admins = await this.adminsService.findAll(paginate)
        return {
            message: SUCCESS,
            result: admins
        }
    }

    @Get('/get-details')
    @UseGuards(JwtAdminAuthGuard)
    async findOne(@Request() req) {
        const result = await this.adminsService.findOne(req.user.userId)
        return {
            message: SUCCESS,
            result: result
        }
    }

    @Get(':id')
    @UseGuards(JwtAdminAuthGuard)
    async findOneById(@Param('id') id: string) {
        const result = await this.adminsService.findOne(id)
        return {
            message: DATA_RETRIEVED,
            result: result
        }
    }

    @Put()
    @UseGuards(JwtAdminAuthGuard)
    async update(@Request() req, @Body() updateAdminDto: UpdateAdminDto) {
        delete updateAdminDto.role
        delete updateAdminDto.status
        const admin = await this.adminsService.update(
            req.user.userId,
            updateAdminDto
        )
        return {
            message: UPDATED,
            result: admin
        }
    }

    @Patch('profile-image')
    @UseInterceptors(FileInterceptor('file'))
    @UseGuards(JwtAdminAuthGuard)
    async uploadProfileImage(@Request() req, @UploadedFile() file) {
        const userData = await this.adminsService.uploadProfileImage(
            req.user.userId,
            file
        )

        return {
            message: UPLOADED,
            result: userData
        }
    }

    @Patch(':id')
    @Permissions(Permission.UPDATE_ADMIN)
    @UseGuards(JwtAdminAuthGuard, PermissionsGuard)
    async updateById(
        @Param('id') id: string,
        @Body() updateAdminDto: UpdateAdminDto
    ) {
        const admin = await this.adminsService.update(id, updateAdminDto)
        return {
            message: UPDATED,
            result: admin
        }
    }

    @Delete(':id')
    @Permissions(Permission.DELETE_ADMIN)
    @UseGuards(JwtAdminAuthGuard, PermissionsGuard)
    async delete(@Param('id') id: string) {
        const admin = await this.adminsService.remove(id)
        return {
            message: DELETED,
            result: admin
        }
    }

    @Put('change-password')
    @UseGuards(JwtAdminAuthGuard)
    async changePassword(
        @Request() req,
        @Body() changePasswordDto: ChangePasswordDto
    ) {
        const userData = await this.adminsService.changePassword(
            req.user.userId,
            changePasswordDto
        )

        return {
            message: PASSWORD_CHANGED,
            result: userData
        }
    }

    @Post('forgot-password')
    async forgotPassword(
        @Request() req,
        @Body() forgotPasswordDto: ForgotPasswordDto
    ) {
        const userData =
            await this.adminsService.forgotPassword(forgotPasswordDto)

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
        const userData =
            await this.adminsService.resetPassword(resetPasswordDto)

        return {
            message: RESET_PASSWORD,
            result: userData
        }
    }

    @Get('validate-reset-link')
    async validateResetLink(@Query('token') token: string) {
        const isValid = await this.adminsService.validateResetToken(token)
        return {
            message: VALIDATED,
            result: isValid
        }
    }
}
