import { IUserWorkerRepository, UserWorkerFilters } from '@/modules/user-workers/domain/user-worker.repository'
import { IUserWorker } from '@/modules/user-workers/domain/user-worker.model'

export class GetAllUserWorkersUseCase {
   constructor(private userWorkerRepository: IUserWorkerRepository) {}

   async execute(filters?: UserWorkerFilters): Promise<{ data: IUserWorker[]; total: number }> {
      return await this.userWorkerRepository.getAll(filters)
   }
}
