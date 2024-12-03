import { CACHE_MANAGER } from '@nestjs/cache-manager'
import { Inject, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Cache } from 'cache-manager'

@Injectable()
export class CacheManagerService {
    constructor(
        @Inject(CACHE_MANAGER) private cacheManager: Cache,
        private readonly configService: ConfigService
    ) {}

    async getValue(key: string): Promise<any> {
        return await this.cacheManager.get(
            this.configService.get('REDIS_CACHE_PREFIX') + '_' + key
        )
    }

    async setValue(key: string, value: any, expires: number) {
        return await this.cacheManager.set(
            this.configService.get('REDIS_CACHE_PREFIX') + '_' + key,
            value,
            1000 * expires // convert to milliseconds to seconds
        )
    }

    async deleteValue(key: string) {
        await this.cacheManager.del(
            this.configService.get('REDIS_CACHE_PREFIX') + '_' + key
        )
    }

    async resetAll() {
        await this.cacheManager.reset()
    }

    async checkStatus(key: string): Promise<boolean> {
        return !!(await this.getValue(key))
    }
}
