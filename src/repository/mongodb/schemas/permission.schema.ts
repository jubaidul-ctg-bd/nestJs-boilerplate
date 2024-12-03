import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import * as uniqueValidator from 'mongoose-unique-validator'

export type PermissionDocument = Permission & Document

@Schema({
    timestamps: true,
    versionKey: false
})
export class Permission {
    @Prop({ trim: true, required: true })
    name: string

    @Prop({ required: true, trim: true, type: String, unique: true })
    slug: string
}

const schema = SchemaFactory.createForClass(Permission)
schema.plugin(uniqueValidator, { message: '{PATH} already exists!' })
export const PermissionSchema = schema
