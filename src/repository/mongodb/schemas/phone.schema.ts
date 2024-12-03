import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'

@Schema({ _id: false })
export class Phone {
    @Prop({
        type: String
        // required: true
    })
    countryCode: string

    @Prop({ type: String, 
        // required: true
     })
    number: string
}

export const PhoneSchema = SchemaFactory.createForClass(Phone)
