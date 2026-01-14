import { IUserWorkerRepository } from '../domain/user-worker.repository'
import { IUserWorker } from '../domain/user-worker.model'

export class MySQLUserWorkerRepository implements IUserWorkerRepository {
   async create(userWorker: IUserWorker): Promise<IUserWorker> {
      // TODO: Implement database create
      return userWorker
   }

   async update(id: number, userWorker: Partial<IUserWorker>): Promise<IUserWorker | null> {
      // TODO: Implement database update
      return userWorker as IUserWorker
   }

   async delete(id: number): Promise<boolean> {
      // TODO: Implement database delete
      return true
   }

   async getAll(): Promise<IUserWorker[]> {
      // TODO: Implement database getAll
      return []
   }

   async getById(id: number): Promise<IUserWorker | null> {
      // TODO: Implement database getById
      return null
   }
}
