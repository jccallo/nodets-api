import { Knex } from 'knex'

export interface PaginationResult<T> {
   data: T[]
   meta: {
      total: number
      page: number
      limit: number
   }
}

export class KnexPaginator {
   static async paginate<T>(params: {
      query: Knex.QueryBuilder
      page?: number
      limit?: number
   }): Promise<PaginationResult<T>> {
      const page = Math.max(1, Number(params.page) || 1)
      const limit = Math.max(1, Number(params.limit) || 10)
      const offset = (page - 1) * limit

      // Clone query to get total count
      const countRes = await params.query.clone().clearSelect().count('id as total').first()
      const total = Number(countRes?.total || 0)

      // Apply pagination to original query
      const data = await params.query.limit(limit).offset(offset)

      return {
         data,
         meta: {
            total,
            page,
            limit,
         },
      }
   }
}
