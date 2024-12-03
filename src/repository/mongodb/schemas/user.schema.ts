import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Types } from 'mongoose'
import * as mongoosePaginate from 'mongoose-paginate-v2'
import * as uniqueValidator from 'mongoose-unique-validator'
import {
    UserGenderEnum,
    UserStatus,
    UserType
} from 'src/repository/enums/user.enum'
import { Phone, PhoneSchema } from 'src/repository/mongodb/schemas/phone.schema'

export type UserDocument = User & Document

@Schema({
    timestamps: true,
    versionKey: false
})
export class User {
    _id?: Types.ObjectId

    @Prop({ trim: true, nullable: true })
    memberKey?: string

    @Prop({ trim: true })
    firstName: string

    @Prop({ trim: true })
    lastName: string

    @Prop({ unique: true, trim: true, required: true })
    email: string

    @Prop({ type: PhoneSchema, required: true }) // Reference the Phone schema here
    phone: Phone

    @Prop({ unique: true, trim: true, index: true, required: true })
    username: string

    @Prop({ type: Date, nullable: true })
    dateOfBirth: Date

    @Prop({ type: String, enum: UserGenderEnum })
    gender: UserGenderEnum

    @Prop({ nullable: true })
    profilePhoto?: string

    @Prop({ nullable: true })
    lastEducation?: string

    @Prop({ nullable: true })
    lastProfession?: string

    @Prop({ nullable: true })
    lastDesignation?: string

    @Prop({ nullable: true })
    lastOrganization?: string

    @Prop({ nullable: true })
    displayName?: string

    @Prop({
        trim: true,
        select: false
    })
    password?: string

    @Prop({
        type: String,
        enum: UserStatus,
        trim: true,
        default: UserStatus.ACTIVE
    })
    status: UserStatus

    @Prop({
        type: String,
        enum: UserType,
        trim: true,
        default: UserType.CLUB_MEMBER
    })
    userType: UserType

    @Prop({ type: Boolean, default: false })
    isOnline?: boolean

    @Prop({ type: Boolean, default: false })
    isValidated?: boolean

    @Prop({ type: Boolean, default: false })
    isProfileCompleted?: boolean

    @Prop({ type: Boolean, default: false })
    isNewsletterSubscribed?: boolean

    @Prop({ type: [String], default: [] })
    fcmTokens?: string[]

    @Prop({ type: String })
    address?: string

    @Prop({ type: Number })
    zip?: number

    @Prop({ type: Date })
    lastLogin?: Date

    @Prop({ type: String })
    lastLoginIp?: string

    @Prop({ type: String })
    lastLoginBrowser?: string

    @Prop({ type: String })
    createIp?: string

    @Prop({ type: Number })
    addedBy?: number
}

const schema = SchemaFactory.createForClass(User)
schema.plugin(uniqueValidator, { message: '{PATH} already exists!' })
schema.plugin(mongoosePaginate)
export const UserSchema = schema
