import { FilterQuery, PaginateOptions } from 'mongoose'
import { Sort } from 'src/repository/interface/sort.interface'

export abstract class IGenericRepository<T> {
    abstract findAll(
        filterQuery?: FilterQuery<T>,
        selector?: string,
        sort?: Sort,
        limit?: number
    ): Promise<T[]>

    abstract findAllPopulate(
        filterQuery?: FilterQuery<T>,
        selector?: string,
        sort?: Sort,
        limit?: number
    ): Promise<T[]>

    abstract findById(id: any): Promise<T>

    abstract countDocuments(filterQuery?: FilterQuery<T>): Promise<number>

    abstract findOne(
        filter: FilterQuery<T>,
        selector?: string,
        sort?: Sort,
        limit?: number
    ): Promise<T>

    abstract findOnePopulate(
        filter: FilterQuery<T>,
        selector?: string,
        sort?: Sort,
        limit?: number
    ): Promise<T>

    abstract paginate(
        filter?: FilterQuery<T>,
        options?: PaginateOptions
    ): Promise<T[]>

    abstract create(item: T): Promise<T>

    abstract insertMany(items: T[]): Promise<T>

    abstract update(id: string, item: Partial<T>)

    abstract deleteOne(filterQuery?: FilterQuery<T>)

    abstract deleteMany(filterQuery?: FilterQuery<T>)

    abstract findOneAndUpdate(
        filterQuery: FilterQuery<T>,
        newData: any
    ): Promise<T>

    abstract aggregation(pipeline?, options?, callback?)

    abstract updateMany(
        filterQuery: FilterQuery<T>,
        newData: Partial<T>
    ): Promise<any>
}
