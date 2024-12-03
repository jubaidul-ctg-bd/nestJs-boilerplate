import { IsNotEmpty, IsString, Matches } from 'class-validator'

export class Phone {
    @IsNotEmpty()
    @IsString()
    @Matches(/^\+\d{1,5}$/, { message: 'Invalid country code' }) // E.g., "+1", "+44"
    countryCode: string

    @IsNotEmpty()
    @IsString()
    @Matches(/^\d{6,15}$/, {
        message: 'Phone number must be between 6 and 15 digits'
    }) // E.g., "123456789"
    number: string
}
