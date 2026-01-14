export interface ICreateUserWorkerDTO {
   userId: number
   specialization: string
   hourlyRate: number
   availability: string
}

export interface IUpdateUserWorkerDTO {
   specialization?: string
   hourlyRate?: number
   availability?: string
}
