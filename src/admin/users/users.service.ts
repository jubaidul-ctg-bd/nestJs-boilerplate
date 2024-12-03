import { Injectable } from '@nestjs/common'
import { FilterUserDto } from 'src/admin/users/dto/filter-user.dto'
import { PaginateDto } from '../../common/dto/paginate.dto'
import { IDataServices } from '../../repository/abstract/i-data-services.abstract'
import { UpdateUserStatusDto } from './dto/update-user-status.dto'

@Injectable()
export class UsersService {
    constructor(private readonly dataServices: IDataServices) {}

    async findAll(paginate: PaginateDto, filterDto: FilterUserDto) {
        const { search, ...filter } = filterDto
        if (search) {
            const searchRegex = new RegExp(search, 'i')
            filter['email'] = { $regex: searchRegex }
        }
        return await this.dataServices.users.paginate(filter, {
            sort: { createdAt: -1 },
            ...paginate
        })
    }

    async findOne(id: string) {
        return await this.dataServices.users.findOne({ _id: id })
    }

    async updateUserStatus(
        id: string,
        updateUserStatusDto: UpdateUserStatusDto
    ) {
        return await this.dataServices.users.findOneAndUpdate(
            {
                _id: id
            },
            updateUserStatusDto
        )
    }
}
