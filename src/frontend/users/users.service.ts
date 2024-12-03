import { MailerService } from '@nestjs-modules/mailer'
import {
    BadRequestException,
    Injectable,
    NotFoundException
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import * as argon2 from 'argon2'
import * as crypto from 'crypto'
import { PaginateDto } from 'src/common/dto/paginate.dto'
import { convertToSlug } from 'src/common/helpers/case-conversion.helper'
import { MailService } from 'src/common/notifications/mail/mail.service'
import { CacheManagerService } from 'src/config/cache-manager/cache-manager.service'
import { FilesService } from 'src/files/files.service'
import { ChangePasswordDto } from 'src/frontend/users/dto/change-password.dto'
import { ForgotPasswordDto } from 'src/frontend/users/dto/forgot-password.dto'
import { ResetPasswordDto } from 'src/frontend/users/dto/reset-password.dto'
import { IDataServices } from 'src/repository/abstract/i-data-services.abstract'
import { UserStatus } from 'src/repository/enums/user.enum'
import { TempStoragesService } from 'src/temp-storages/temp-storages.service'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'

@Injectable()
export class UsersService {
    constructor(
        private readonly dataServices: IDataServices,
        private readonly mailService: MailService,
        private readonly configService: ConfigService,
        private readonly cacheManagerService: CacheManagerService,
        private readonly filesService: FilesService,
        private readonly tempStoragesService: TempStoragesService,
        private readonly mailerService: MailerService
    ) {}

    async create(createUserDto: CreateUserDto) {
        createUserDto.password = await argon2.hash(createUserDto.password)
        createUserDto.username = createUserDto.username
            ? createUserDto.username
            : convertToSlug(
                  createUserDto.firstName + ' ' + createUserDto.lastName
              )
        const userNameExist = await this.dataServices.users.countDocuments({
            username: createUserDto.username
        })

        createUserDto.username = userNameExist
            ? createUserDto.username + Math.floor(Math.random() * 10000)
            : createUserDto.username

        const createdUser = await this.dataServices.users.create({
            ...createUserDto,
            status: UserStatus.ACTIVE,
            fcmTokens: [createUserDto.fcmToken]
        })

        const loginUrl = `${this.configService.get('WEB_URL')}/login`

        // this.mailService.sendSingleMail({
        //     mail_template_key: SUCCESS_TEMPLATE_KEY,
        //     to: [
        //         {
        //             email_address: {
        //                 address: createdUser.email,
        //                 name: createdUser.firstName + ' ' + createdUser.lastName
        //             }
        //         }
        //     ],
        //     merge_info: {
        //         login_link: loginUrl,
        //         name: createdUser.firstName + ' ' + createdUser.lastName,
        //         team: 'Example',
        //         product_name: 'Example'
        //     },
        //     subject: 'Welcome to Example'
        // })

        await this.mailerService.sendMail({
            to: createdUser.email,
            subject: 'Welcome to Example',
            template: './welcome-template',
            context: {
                login_link: loginUrl,
                name: createdUser.firstName + ' ' + createdUser.lastName,
                team: 'Example',
                product_name: 'Example'
            }
        })
        return {}
    }

    async findAll(paginate: PaginateDto) {
        return await this.dataServices.users.paginate({}, paginate)
    }

    async findOne(id: string) {
        return await this.dataServices.users.findOnePopulate({ _id: id })
    }

    async update(id: string, updateUserDto: UpdateUserDto) {
        return await this.dataServices.users.findOneAndUpdate(
            { _id: id },
            updateUserDto
        )
    }

    async completeAccount(token: string, updateUserDto: UpdateUserDto) {
        const user = await this.dataServices.users.findOne({ memberKey: token })
        if (!user || user.status != UserStatus.INCOMPLETE) {
            throw new NotFoundException('Invalid link')
        }
        if (updateUserDto.password)
            updateUserDto.password = await argon2.hash(updateUserDto.password)
        return await this.dataServices.users.findOneAndUpdate(
            { _id: user._id },
            {
                ...updateUserDto,
                status: UserStatus.ACTIVE
            }
        )
    }

    async uploadProfileImage(id: string, file) {
        if (file) {
            const user = await this.dataServices.users.findOne(
                { _id: id },
                'profilePhoto name'
            )
            const uploadedFileData = await this.filesService.uploadPublicFile(
                file,
                'profile',
                user.firstName
            )

            if (user?.profilePhoto) {
                await this.filesService.deletePublicFile(user.profilePhoto)
            }

            await this.dataServices.users.findOneAndUpdate(
                { _id: id },
                { profilePhoto: uploadedFileData.key }
            )
            return { profilePhoto: uploadedFileData.key }
        }

        return {}
    }

    async changePassword(id: string, changePasswordDto: ChangePasswordDto) {
        const user = await this.dataServices.users.findOne(
            { _id: id },
            '+password'
        )
        if (
            !(await argon2.verify(user.password, changePasswordDto.oldPassword))
        ) {
            throw new BadRequestException('Old password is incorrect')
        }
        await this.dataServices.users.findOneAndUpdate(
            { _id: id },
            { password: await argon2.hash(changePasswordDto.password) }
        )
        return {}
    }

    async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
        const user = await this.dataServices.users.findOne({
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

        const resetUrl = `${this.configService.get('WEB_URL')}/reset-password?token=${token}`

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

        await this.dataServices.users.findOneAndUpdate(
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

    async emailValidation(token: string) {
        const user = await this.dataServices.users.findOneAndUpdate(
            { memberKey: token },
            { isValidated: true }
        )

        if (!user) {
            throw new BadRequestException('Invalid link')
        }
        return {}
    }

    async completeAccountLinkValidation(token: string) {
        const user = await this.dataServices.users.findOne({ memberKey: token })

        if (!user) {
            throw new BadRequestException('Invalid link')
        }
        return user
    }

    async remove(id: string) {
        return await this.dataServices.users.deleteOne({ _id: id })
    }
}
