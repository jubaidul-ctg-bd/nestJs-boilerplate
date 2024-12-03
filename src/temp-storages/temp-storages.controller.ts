import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common'
import {
    CREATED,
    DATA_RETRIEVED,
    DELETED
} from 'src/common/utils/response-message.util'
import { CreateTempStorageDto } from './dto/create-temp-storage.dto'
import { TempStoragesService } from './temp-storages.service'

@Controller({
    version: '1',
    path: 'api/temp-storages'
})
export class TempStoragesController {
    constructor(private readonly tempStoragesService: TempStoragesService) {}

    @Post()
    async create(@Body() createTempStorageDto: CreateTempStorageDto) {
        return {
            message: CREATED,
            result: await this.tempStoragesService.setValue(
                createTempStorageDto.key,
                createTempStorageDto.value,
                createTempStorageDto.ttl
            )
        }
    }

    @Get(':key')
    async findOne(@Param('key') key: string) {
        return {
            message: DATA_RETRIEVED,
            result: await this.tempStoragesService.getValue(key)
        }
    }

    @Delete()
    async resetAll(@Param('key') key: string) {
        return {
            message: DELETED,
            result: await this.tempStoragesService.resetAll(key)
        }
    }

    @Delete(':key')
    async remove(@Param('key') key: string) {
        return {
            message: DELETED,
            result: await this.tempStoragesService.deleteValue(key)
        }
    }
}
