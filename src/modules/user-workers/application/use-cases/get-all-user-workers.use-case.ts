import { IUserWorkerRepository } from '../../domain/user-worker.repository'
import { IUserWorker } from '../../domain/user-worker.model'

export class GetAllUserWorkersUseCase {
   constructor(private userWorkerRepository: IUserWorkerRepository) {}

   async execute(): Promise<IUserWorker[]> {
      return await this.userWorkerRepository.getAll()
   }
}
