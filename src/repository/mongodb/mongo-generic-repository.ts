import { FilterQuery, PaginateModel, PaginateOptions } from 'mongoose'
import { Sort } from 'src/repository/interface/sort.interface'
import { IGenericRepository } from '../abstract/i-generic-repository.abstract'

export class MongoGenericRepository<T> implements IGenericRepository<T> {
    private _repository: PaginateModel<T>
    private readonly _populateOnFind: string[]

    constructor(repository: PaginateModel<T>, populateOnFind: string[] = []) {
        this._repository = repository
        this._populateOnFind = populateOnFind
    }

    findAll(
        filterQuery?: FilterQuery<T>,
        selector?: string,
        sort?: Sort,
        limit?: number
    ): any {
        let query = filterQuery
            ? this._repository.find(filterQuery)
            : this._repository.find()
        if (sort) {
            const sortObj = {}
            sortObj[sort.field] = sort.order
            query = query.sort(sortObj)
        }
        query = sort ? query.sort(`{${sort.field} : ${sort.order}}`) : query
        query = selector ? query.select(selector) : query
        query = limit ? query.limit(limit) : query
        return query.lean().exec()
    }

    findAllPopulate(
        filterQuery?: FilterQuery<T>,
        selector?: string,
        sort?: Sort,
        limit?: number
    ): any {
        let query = filterQuery
            ? this._repository.find(filterQuery)
            : this._repository.find()
        if (sort) {
            const sortObj = {}
            sortObj[sort.field] = sort.order
            query = query.sort(sortObj)
        }
        query = sort ? query.sort(`{${sort.field} : ${sort.order}}`) : query
        query = selector ? query.select(selector) : query
        query = limit ? query.limit(limit) : query
        return query.populate(this._populateOnFind).lean().exec()
    }

    countDocuments(filterQuery?: FilterQuery<T>): any {
        return this._repository.countDocuments(filterQuery).exec()
    }

    findById(id: any): Promise<T> {
        return this._repository
            .findById(id)
            .populate(this._populateOnFind)
            .exec()
    }

    paginate(filter?: FilterQuery<T>, options?: PaginateOptions): any {
        return this._repository.paginate(filter, options)
    }

    create(item: T): Promise<T> {
        return this._repository.create(item)
    }

    insertMany(items: T[]): Promise<any> {
        return this._repository.insertMany(items)
    }

    update(id: string, item: Partial<T>) {
        return this._repository.findByIdAndUpdate(id, item)
    }

    deleteOne(filterQuery?: FilterQuery<T>): any {
        return this._repository.deleteOne(filterQuery)
    }

    deleteMany(filterQuery?: FilterQuery<T>): any {
        return this._repository.deleteMany(filterQuery)
    }

    findOne(
        filter: FilterQuery<T>,
        selector?: string,
        sort?: Sort,
        limit?: number
    ): any {
        let query = this._repository.findOne(filter)
        if (sort) {
            const sortObj = {}
            sortObj[sort.field] = sort.order
            query = query.sort(sortObj)
        }
        query = sort ? query.sort(`{${sort.field} : ${sort.order}}`) : query
        query = selector ? query.select(selector) : query
        query = limit ? query.limit(limit) : query
        return query.lean()
    }

    findOnePopulate(
        filter: FilterQuery<T>,
        selector?: string,
        sort?: Sort,
        limit?: number
    ): any {
        let query = this._repository.findOne(filter)
        if (sort) {
            const sortObj = {}
            sortObj[sort.field] = sort.order
            query = query.sort(sortObj)
        }
        query = sort ? query.sort(`{${sort.field} : ${sort.order}}`) : query
        query = selector ? query.select(selector) : query
        query = limit ? query.limit(limit) : query
        return query.populate(this._populateOnFind).lean()
    }

    aggregation(pipeline?, options?, callback?) {
        return this._repository.aggregate(pipeline, options)
    }

    findOneAndUpdate(
        filterQuery: FilterQuery<T>,
        newData: any,
        sort?: Sort
    ): any {
        let query = this._repository.findOneAndUpdate(filterQuery, newData, {
            new: true
        })
        if (sort) {
            const sortObj = {}
            sortObj[sort.field] = sort.order
            query = query.sort(sortObj)
        }
        return query.populate(this._populateOnFind).lean()
    }

    updateMany(filterQuery: FilterQuery<T>, newData: Partial<T>): Promise<any> {
        return this._repository.updateMany(filterQuery, newData, {
            new: true
        })
    }
}
