import { Injectable } from '@nestjs/common'
import { IDataServices } from 'src/repository/abstract/i-data-services.abstract'

@Injectable()
export class TempStoragesService {
    constructor(private readonly dataServices: IDataServices) {}
    async setValue(key: string, value: any, ttl: string) {
        const expirationDate = new Date()
        const timeUnit = ttl.slice(-1) // Get the last character
        const timeValue = parseInt(ttl.slice(0, -1), 10) // Extract the numeric part

        if (isNaN(timeValue)) {
            throw new Error('Invalid TTL format')
        }

        switch (timeUnit) {
            case 's': // Seconds
                expirationDate.setSeconds(
                    expirationDate.getSeconds() + timeValue
                )
                break
            case 'm': // Minutes
                expirationDate.setMinutes(
                    expirationDate.getMinutes() + timeValue
                )
                break
            case 'd': // Days
                expirationDate.setDate(expirationDate.getDate() + timeValue)
                break
            default:
                throw new Error('Invalid time unit. Use "s", "m", or "d".')
        }

        if (await this.getValue(key)) {
            await this.deleteValue(key)
        }

        return await this.dataServices.tempStorage.create({
            key,
            value,
            expiresAt: expirationDate
        })
    }

    async getValue(key: string) {
        const storeValue = await this.dataServices.tempStorage.findOne({ key })
        return storeValue?.value
    }

    async deleteValue(key: string) {
        return await this.dataServices.tempStorage.deleteOne({ key })
    }

    async resetAll(key: string) {
        return await this.dataServices.tempStorage.deleteMany()
    }
}
