import { IUserWorker } from './user-worker.model'

export interface IUserWorkerRepository {
   create(userWorker: IUserWorker): Promise<IUserWorker>
   update(id: number, userWorker: Partial<IUserWorker>): Promise<IUserWorker | null>
   delete(id: number): Promise<boolean>
   getAll(): Promise<IUserWorker[]>
   getById(id: number): Promise<IUserWorker | null>
}
