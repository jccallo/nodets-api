import { IUserWorkerRepository } from '../../domain/user-worker.repository'

export class DeleteUserWorkerUseCase {
   constructor(private userWorkerRepository: IUserWorkerRepository) {}

   async execute(id: number): Promise<boolean> {
      return await this.userWorkerRepository.delete(id)
   }
}
