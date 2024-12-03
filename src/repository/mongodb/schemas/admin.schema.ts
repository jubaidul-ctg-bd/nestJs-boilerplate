import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Types } from 'mongoose'
import * as mongoosePaginate from 'mongoose-paginate-v2'
import * as uniqueValidator from 'mongoose-unique-validator'
import { Phone, PhoneSchema } from 'src/repository/mongodb/schemas/phone.schema'

export type AdminDocument = Admin & Document

export enum AdminStatusEnum {
    ACTIVE = 'active',
    INACTIVE = 'inactive',
    SUSPENDED = 'suspended'
}

export enum AdminTypeEnum {
    ADMIN = 'admin',
    SUPER_ADMIN = 'super-admin'
}

@Schema({
    timestamps: true,
    versionKey: false
})
export class Admin {
    _id?: Types.ObjectId

    @Prop({ type: Number })
    id?: number

    @Prop({ type: String, trim: true })
    firstName: string

    @Prop({ type: String, trim: true })
    lastName: string

    @Prop({ type: String, trim: true, required: true, unique: true })
    email: string

    @Prop({ unique: true, trim: true, index: true, required: true })
    username: string

    @Prop({ type: PhoneSchema }) // Reference the Phone schema here
    phone?: Phone

    @Prop({ type: String, trim: true, required: true, select: false })
    password: string

    @Prop({
        type: String,
        required: true,
        enum: AdminStatusEnum,
        default: AdminStatusEnum.ACTIVE
    })
    status: AdminStatusEnum

    @Prop({ nullable: true })
    profilePhoto?: string

    @Prop({ type: String })
    department?: string

    @Prop({ type: String })
    designation?: string

    @Prop({ type: Date })
    lastLogin?: Date

    @Prop({ type: String })
    lastLoginIp?: string

    @Prop({ type: String })
    lastLoginBrowser?: string

    @Prop({ type: String })
    createIp?: string

    @Prop({ type: Number }) // 0 = owen, 1 = admin
    addedBy?: number

    @Prop({
        type: Types.ObjectId,
        ref: 'Role',
        set: (value) => Types.ObjectId.createFromHexString(value)
    })
    role: Types.ObjectId
}

const schema = SchemaFactory.createForClass(Admin)
schema.plugin(uniqueValidator, { message: '{PATH} already exists!' })
schema.plugin(mongoosePaginate)
export const AdminSchema = schema
