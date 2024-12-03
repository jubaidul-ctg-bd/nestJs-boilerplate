import { plainToInstance } from 'class-transformer'
import {
    IsEnum,
    IsNumber,
    IsString,
    Max,
    Min,
    validateSync
} from 'class-validator'

enum Environment {
    Development = 'development',
    Production = 'production',
    Test = 'test',
    Provision = 'provision'
}

class EnvironmentVariables {
    @IsEnum(Environment)
    NODE_ENV: Environment

    @IsNumber()
    @Min(0)
    @Max(65535)
    PORT: number

    @IsString()
    MONGODB: string

    @IsString()
    jwtSecret: string

    @IsString()
    jwtValidTime: string

    @IsString()
    AWS_ACCESS_KEY_ID: string

    @IsString()
    AWS_SECRET_ACCESS_KEY: string

    @IsString()
    AWS_REGION: string

    @IsString()
    AWS_BUCKET_NAME: string

    @IsString()
    AWS_BUCKET_URL: string

    @IsString()
    MAIL_HOST: string

    @IsNumber()
    MAIL_PORT: number

    @IsString()
    MAIL_USERNAME: string

    @IsString()
    MAIL_PASSWORD: string

    @IsString()
    MAIL_FROM_ADDRESS: string

    @IsString()
    MAIL_FROM_NAME: string

    @IsString()
    MAIL_ENCRYPTION: string

    @IsString()
    WEB_URL: string

    @IsString()
    ADMIN_URL: string

    // @IsNumber()
    // HTTP_TIMEOUT: number

    @IsString()
    REDIS_HOST: string

    // @IsString()
    // REDIS_USER: string

    @IsString()
    REDIS_PASSWORD: string

    @IsNumber()
    REDIS_PORT: number

    @IsString()
    REDIS_CACHE_PREFIX: string

    @IsString()
    ZEPTO_MAIL_URL: string

    @IsString()
    ZEPTO_MAIL_TOKEN: string

    @IsString()
    ZEPTO_MAIL_ADDRESS: string

    @IsString()
    ZEPTO_MAIL_NAME: string
}

export function validate(config: Record<string, unknown>) {
    const validatedConfig = plainToInstance(EnvironmentVariables, config, {
        enableImplicitConversion: true
    })
    const errors = validateSync(validatedConfig, {
        skipMissingProperties: false
    })

    if (errors.length > 0) {
        throw new Error(errors.toString())
    }
    return validatedConfig
}
