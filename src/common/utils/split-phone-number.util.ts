import parsePhoneNumberFromString from 'libphonenumber-js'
export function splitPhoneNumber(phone) {
    try {
        const phoneNumber = parsePhoneNumberFromString(phone)
        if (phoneNumber) {
            return {
                countryCode: `+${phoneNumber.countryCallingCode}`,
                number: phoneNumber.nationalNumber
            }
        } else {
            return null
        }
    } catch (error) {
        return null
    }
}
