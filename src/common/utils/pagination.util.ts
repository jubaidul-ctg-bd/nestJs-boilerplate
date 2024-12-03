interface PaginateResult {
    totalDocs: number
    limit: number
    totalPages: number
    page: number
    pagingCounter: number
    hasPrevPage: boolean
    hasNextPage: boolean
    prevPage: number | null
    nextPage: number | null
}

export function paginateResult(
    totalDocs: number,
    page: number,
    limit: number
): PaginateResult {
    const totalPages = Math.ceil(totalDocs / limit)
    return {
        totalDocs,
        limit,
        totalPages,
        page,
        pagingCounter: (page - 1) * limit + 1,
        hasPrevPage: page > 1,
        hasNextPage: page < totalPages,
        prevPage: page > 1 ? page - 1 : null,
        nextPage: page < totalPages ? page + 1 : null
    }
}
