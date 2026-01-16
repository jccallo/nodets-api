import { IUserWorker } from '@/modules/user-workers/domain/user-worker.model'

export interface UserWorkerFilters {
   name?: string
   page?: number
   limit?: number
}

export interface IUserWorkerRepository {
   create(userWorker: IUserWorker): Promise<IUserWorker>
   update(id: number, userWorker: Partial<IUserWorker>): Promise<IUserWorker | null>
   delete(id: number): Promise<boolean>
   getAll(filters?: UserWorkerFilters): Promise<{ data: IUserWorker[]; total: number }>
   getById(id: number): Promise<IUserWorker | null>
}
