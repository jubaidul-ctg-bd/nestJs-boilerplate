import { Type } from 'class-transformer'
import { IsInt, IsNotEmpty } from 'class-validator'

export class PaginateDto {
    @IsInt()
    @IsNotEmpty()
    @Type(() => Number)
    page: number

    @IsInt()
    @IsNotEmpty()
    @Type(() => Number)
    limit: number
}
