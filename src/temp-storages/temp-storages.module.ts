import { Global, Module } from '@nestjs/common'
import { TempStoragesController } from './temp-storages.controller'
import { TempStoragesService } from './temp-storages.service'

@Global()
@Module({
    controllers: [TempStoragesController],
    providers: [TempStoragesService],
    exports: [TempStoragesService]
})
export class TempStoragesModule {}
