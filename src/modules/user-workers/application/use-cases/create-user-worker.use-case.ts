import { IUserWorkerRepository } from '@/modules/user-workers/domain/user-worker.repository'
import { IUserWorker } from '@/modules/user-workers/domain/user-worker.model'
import { ICreateUserWorkerDTO } from '@/modules/user-workers/application/dto'

export class CreateUserWorkerUseCase {
   constructor(private userWorkerRepository: IUserWorkerRepository) {}

   async execute(data: ICreateUserWorkerDTO): Promise<IUserWorker> {
      return await this.userWorkerRepository.create(data as IUserWorker)
   }
}
