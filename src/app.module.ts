import { Module, Scope } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core'
import { AllExceptionsFilter } from 'src/common/filters/custom-exception.filter'
import { LoggingInterceptor } from 'src/common/interceptors/logging.interceptor'
import { ResponseInterceptor } from 'src/common/interceptors/response.interceptor'
import { MailModule } from 'src/common/notifications/mail/mail.module'
import { FreezePipe } from 'src/common/pipes/freeze.pipe'
import { CacheManagerModule } from 'src/config/cache-manager/cache-manager.module'
import { validate } from 'src/config/env.validation'
import { RepositoryModule } from 'src/repository/repository.module'
import { AdminModule } from './admin/admin.module'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { FrontendModule } from './frontend/frontend.module'
import { FilesModule } from './files/files.module';
import { TempStoragesModule } from './temp-storages/temp-storages.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            validate,
            isGlobal: true
        }),
        MailModule,
        CacheManagerModule,
        RepositoryModule,
        AdminModule,
        FrontendModule,
        FilesModule,
        TempStoragesModule
    ],
    controllers: [AppController],
    providers: [
        AppService,
        {
            provide: APP_INTERCEPTOR,
            scope: Scope.REQUEST,
            useClass: LoggingInterceptor
        },
        {
            provide: APP_INTERCEPTOR,
            scope: Scope.REQUEST,
            useClass: ResponseInterceptor
        },
        {
            provide: APP_PIPE,
            useClass: FreezePipe
        },
        {
            provide: APP_FILTER,
            useClass: AllExceptionsFilter
        }
    ]
})
export class AppModule {}
