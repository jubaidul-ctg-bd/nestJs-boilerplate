import { ConfigModule, ConfigService } from '@nestjs/config'

export const httpConfig = () => {
    return {
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: async (configService: ConfigService) => ({
            timeout: configService.get('HTTP_TIMEOUT')
        })
    }
}
