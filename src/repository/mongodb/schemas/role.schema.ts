import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Types } from 'mongoose'
import * as uniqueValidator from 'mongoose-unique-validator'

export type RoleDocument = Role & Document

export enum RoleStatusEnum {
    ACTIVE = 'active',
    INACTIVE = 'inactive'
}

@Schema({
    timestamps: true,
    versionKey: false
})
export class Role {
    @Prop({ trim: true, required: true, unique: true, type: String })
    name: string

    @Prop({ required: true, unique: true, type: String })
    slug: string

    @Prop({ trim: true, required: true, enum: RoleStatusEnum })
    status: RoleStatusEnum

    @Prop([
        {
            permission: {
                type: Types.ObjectId,
                ref: 'Permission',
                set: (value: string) =>
                    Types.ObjectId.createFromHexString(value)
            },
            slug: { type: String, required: true }
        }
    ])
    permissions: { permission: Types.ObjectId; slug: string }[]
}

const schema = SchemaFactory.createForClass(Role)
schema.plugin(uniqueValidator, { message: '{PATH} already exists!' })
export const RoleSchema = schema
