import { IUserWorkerRepository } from '../../domain/user-worker.repository'
import { IUserWorker } from '../../domain/user-worker.model'
import { IUpdateUserWorkerDTO } from '../dto'

export class UpdateUserWorkerUseCase {
   constructor(private userWorkerRepository: IUserWorkerRepository) {}

   async execute(id: number, data: IUpdateUserWorkerDTO): Promise<IUserWorker | null> {
      return await this.userWorkerRepository.update(id, data)
   }
}
