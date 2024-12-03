import { MailerService } from '@nestjs-modules/mailer'
import {
    BadRequestException,
    Injectable,
    NotFoundException
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import * as argon2 from 'argon2'
import * as crypto from 'crypto'
import { ChangePasswordDto } from 'src/admin/admins/dto/change-password.dto'
import { ForgotPasswordDto } from 'src/admin/admins/dto/forgot-password.dto'
import { ResetPasswordDto } from 'src/admin/admins/dto/reset-password.dto'
import { PaginateDto } from 'src/common/dto/paginate.dto'
import { convertToSlug } from 'src/common/helpers/case-conversion.helper'
import { MailService } from 'src/common/notifications/mail/mail.service'
import { CacheManagerService } from 'src/config/cache-manager/cache-manager.service'
import { FilesService } from 'src/files/files.service'
import { TempStoragesService } from 'src/temp-storages/temp-storages.service'
import { IDataServices } from '../../repository/abstract/i-data-services.abstract'
import { AdminStatusEnum } from '../../repository/mongodb/schemas/admin.schema'
import { CreateAdminDto } from './dto/create-admin.dto'
import { UpdateAdminDto } from './dto/update-admin.dto'

@Injectable()
export class AdminsService {
    constructor(
        private readonly dataServices: IDataServices,
        private readonly mailService: MailService,
        private readonly configService: ConfigService,
        private readonly cacheManagerService: CacheManagerService,
        private readonly filesService: FilesService,
        private readonly tempStoragesService: TempStoragesService,
        private readonly mailerService: MailerService
    ) {}

    async create(createAdminDto: CreateAdminDto) {
        createAdminDto.password = await argon2.hash(createAdminDto.password)

        createAdminDto.username = createAdminDto.username
            ? createAdminDto.username
            : convertToSlug(
                  createAdminDto.firstName + ' ' + createAdminDto.lastName
              )
        const userNameExist = await this.dataServices.admins.countDocuments({
            username: createAdminDto.username
        })

        createAdminDto.username = userNameExist
            ? createAdminDto.username + Math.floor(Math.random() * 10000)
            : createAdminDto.username

        return await this.dataServices.admins.create({
            ...createAdminDto,
            status: AdminStatusEnum.ACTIVE
        })
    }

    async findAll(paginate: PaginateDto) {
        return this.dataServices.admins.paginate(
            {},
            {
                ...paginate,
                populate: [
                    {
                        path: 'role',
                        select: 'name slug'
                    }
                ]
            }
        )
    }

    async findOne(id: string) {
        return await this.dataServices.admins.findOnePopulate({ _id: id })
    }

    async update(id: string, updateAdminDto: UpdateAdminDto) {
        return await this.dataServices.admins.findOneAndUpdate(
            {
                _id: id
            },
            updateAdminDto
        )
    }

    async remove(id: string) {
        return await this.dataServices.admins.deleteOne({
            _id: id
        })
    }

    async changePassword(id: string, changePasswordDto: ChangePasswordDto) {
        const user = await this.dataServices.admins.findOne(
            { _id: id },
            '+password'
        )

        if (
            !(await argon2.verify(user.password, changePasswordDto.oldPassword))
        ) {
            throw new BadRequestException('Old password is incorrect')
        }
        await this.dataServices.admins.findOneAndUpdate(
            { _id: id },
            { password: await argon2.hash(changePasswordDto.password) }
        )
        return {}
    }

    async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
        const user = await this.dataServices.admins.findOne({
            email: forgotPasswordDto.email
        })

        if (!user) {
            throw new NotFoundException('User not found')
        }

        const token = crypto.randomBytes(32).toString('hex')
        const expiration = 10 // 10 minutes
        await this.tempStoragesService.setValue(token, user['_id'], '10m')
        // await this.cacheManagerService.setValue(
        //     token,
        //     user['_id'],
        //     60 * expiration
        // )

        const resetUrl = `${this.configService.get('ADMIN_URL')}/reset-password?token=${token}`

        // this.mailService.sendSingleMail({
        //     mail_template_key: RESET_PASSWORD_TEMPLATE_KEY,
        //     to: [
        //         {
        //             email_address: {
        //                 address: user.email,
        //                 name: user.firstName + ' ' + user.lastName
        //             }
        //         }
        //     ],
        //     merge_info: {
        //         password_reset_link: resetUrl,
        //         name: user.firstName + ' ' + user.lastName,
        //         valid_time: expiration.toString(),
        //         team: 'Example',
        //         product_name: 'Example',
        //         username: user.username
        //     },
        //     subject: 'Reset Your Password'
        // })
        await this.mailerService.sendMail({
            to: user.email,
            subject: 'Reset Your Password',
            template: './password-reset.hbs',
            context: {
                password_reset_link: resetUrl,
                name: user.firstName + ' ' + user.lastName,
                valid_time: expiration.toString(),
                team: 'Example',
                product_name: 'Example',
                username: user.username
            }
        })
        return {}
    }

    async resetPassword(resetPasswordDto: ResetPasswordDto) {
        const userId = await this.tempStoragesService.getValue(
            resetPasswordDto.token
        )
        // const userId = await this.cacheManagerService.getValue(
        //     resetPasswordDto.token
        // )

        if (!userId) {
            throw new BadRequestException('Invalid or expired token')
        }

        await this.dataServices.admins.findOneAndUpdate(
            { _id: userId },
            { password: await argon2.hash(resetPasswordDto.password) }
        )
        await this.tempStoragesService.deleteValue(resetPasswordDto.token)
        // await this.cacheManagerService.deleteValue(resetPasswordDto.token)
        return {}
    }

    async validateResetToken(token: string) {
        const isValid = await this.tempStoragesService.getValue(token)
        // const isValid = await this.cacheManagerService.checkStatus(token)

        if (!isValid) {
            throw new BadRequestException('Invalid or expired link')
        }
        return {}
    }

    async uploadProfileImage(id: string, file) {
        if (file) {
            const admin = await this.dataServices.admins.findOne(
                { _id: id },
                'profilePhoto name'
            )
            const uploadedFileData = await this.filesService.uploadPublicFile(
                file,
                'profile',
                admin.firstName
            )

            if (admin?.profilePhoto) {
                await this.filesService.deletePublicFile(admin.profilePhoto)
            }

            await this.dataServices.admins.findOneAndUpdate(
                { _id: id },
                { profilePhoto: uploadedFileData.key }
            )
            return { profilePhoto: uploadedFileData.key }
        }

        return {}
    }
}
