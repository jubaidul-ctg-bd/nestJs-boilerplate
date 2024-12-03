import { CacheModule } from '@nestjs/cache-manager'
import { Global, Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import * as redisStore from 'cache-manager-redis-store'
import { CacheManagerService } from './cache-manager.service'

@Global()
@Module({
    imports: [
        CacheModule.register({
            isGlobal: true,
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => {
                return {
                    store: redisStore,
                    url: `redis://${configService.get('REDIS_HOST')}:${configService.get('REDIS_PORT')}`,
                    auth_pass: configService.get('REDIS_PASSWORD')
                }
            }
        })
    ],
    providers: [CacheManagerService],
    exports: [CacheManagerService]
})
export class CacheManagerModule {}
