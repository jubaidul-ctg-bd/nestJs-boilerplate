import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Schema as MongooseSchema } from 'mongoose'
import * as uniqueValidator from 'mongoose-unique-validator'

export type TempStorageDocument = TempStorage & Document

@Schema({
    timestamps: false,
    versionKey: false
})
export class TempStorage {
    @Prop({ trim: true, required: true, unique: true, type: String })
    key: string

    @Prop({ required: true, type: MongooseSchema.Types.Mixed })
    value: any

    @Prop({ type: Date, index: { expires: 0 }, required: true }) // TTL index
    expiresAt: Date // Expiration time
}

const schema = SchemaFactory.createForClass(TempStorage)
schema.plugin(uniqueValidator, { message: '{PATH} already exists!' })
export const TempStorageSchema = schema
