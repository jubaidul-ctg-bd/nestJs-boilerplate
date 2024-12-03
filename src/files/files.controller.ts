import {
    Body,
    Controller,
    Post,
    UploadedFile,
    UseInterceptors
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { SUCCESS } from 'src/common/utils/response-message.util'
import { FilesService } from './files.service'

@Controller('files')
export class FilesController {
    constructor(private readonly filesService: FilesService) {}

    @Post()
    @UseInterceptors(FileInterceptor('file'))
    async imageUpload(@UploadedFile() file, @Body() body) {
        const imageData = await this.filesService.uploadPublicFile(
            file,
            `${body.type}/`
        )

        return {
            message: SUCCESS,
            result: imageData?.key
        }
    }

    // @Post()
    // create(@Body() createFileDto: CreateFileDto) {
    //     return this.filesService.create(createFileDto)
    // }

    // @Get()
    // findAll() {
    //     return this.filesService.findAll()
    // }

    // @Get(':id')
    // findOne(@Param('id') id: string) {
    //     return this.filesService.findOne(+id)
    // }

    // @Patch(':id')
    // update(@Param('id') id: string, @Body() updateFileDto: UpdateFileDto) {
    //     return this.filesService.update(+id, updateFileDto)
    // }

    // @Delete(':id')
    // remove(@Param('id') id: string) {
    //     return this.filesService.remove(+id)
    // }
}
