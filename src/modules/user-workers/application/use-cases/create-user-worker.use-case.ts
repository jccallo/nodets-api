import { IUserWorkerRepository } from '../../domain/user-worker.repository'
import { IUserWorker } from '../../domain/user-worker.model'
import { ICreateUserWorkerDTO } from '../dto'

export class CreateUserWorkerUseCase {
   constructor(private userWorkerRepository: IUserWorkerRepository) {}

   async execute(data: ICreateUserWorkerDTO): Promise<IUserWorker> {
      return await this.userWorkerRepository.create(data as IUserWorker)
   }
}
