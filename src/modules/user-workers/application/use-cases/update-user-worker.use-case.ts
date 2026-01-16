import { IUserWorkerRepository } from '@/modules/user-workers/domain/user-worker.repository'
import { IUserWorker } from '@/modules/user-workers/domain/user-worker.model'
import { IUpdateUserWorkerDTO } from '@/modules/user-workers/application/dto'

export class UpdateUserWorkerUseCase {
   constructor(private userWorkerRepository: IUserWorkerRepository) {}

   async execute(id: number, data: IUpdateUserWorkerDTO): Promise<IUserWorker | null> {
      return await this.userWorkerRepository.update(id, data)
   }
}
