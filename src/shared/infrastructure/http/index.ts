import { AxiosClient } from '@/shared/infrastructure/http/axios-client'

export const httpClient = new AxiosClient()
export * from './http-client.interface'
export * from './axios-client'
