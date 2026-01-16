import { IUserWorkerRepository } from '@/modules/user-workers/domain/user-worker.repository'
import { IUserWorker } from '@/modules/user-workers/domain/user-worker.model'

export class GetUserWorkerByIdUseCase {
   constructor(private userWorkerRepository: IUserWorkerRepository) {}

   async execute(id: number): Promise<IUserWorker | null> {
      return await this.userWorkerRepository.getById(id)
   }
}
