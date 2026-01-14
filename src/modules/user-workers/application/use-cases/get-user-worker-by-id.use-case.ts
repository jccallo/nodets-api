import { IUserWorkerRepository } from '../../domain/user-worker.repository'
import { IUserWorker } from '../../domain/user-worker.model'

export class GetUserWorkerByIdUseCase {
   constructor(private userWorkerRepository: IUserWorkerRepository) {}

   async execute(id: number): Promise<IUserWorker | null> {
      return await this.userWorkerRepository.getById(id)
   }
}
