import axios, { AxiosInstance, AxiosRequestConfig, AxiosError } from 'axios'
import { HttpClient, HttpRequestConfig } from '@/shared/infrastructure/http/http-client.interface'
import { AppError } from '@/shared/domain/exceptions/app-error'
import { HttpStatus } from '@/shared/http-status'

export class AxiosClient implements HttpClient {
   private client: AxiosInstance
   private token: string | null = null

   constructor(config?: AxiosRequestConfig) {
      this.client = axios.create(config)
      this.setupInterceptors()
   }

   private setupInterceptors() {
      this.client.interceptors.request.use((config) => {
         if (this.token) {
            console.log(`[HTTP] Inyectando Token Global: ${this.token}`)
            config.headers.Authorization = `Bearer ${this.token}`
         } else {
            console.log('[HTTP] Sin Token Global configurado.')
         }
         return config
      })
   }

   setToken(token: string): void {
      this.token = token
   }

   private mapConfig(config?: HttpRequestConfig): AxiosRequestConfig {
      if (!config) return {}
      return {
         headers: config.headers,
         params: config.params,
         timeout: config.timeout,
      }
   }

   private handleError(error: unknown): never {
      if (axios.isAxiosError(error)) {
         const axiosError = error as AxiosError<any>
         const statusCode = (axiosError.response?.status as HttpStatus) || HttpStatus.INTERNAL_SERVER_ERROR
         const message = axiosError.response?.data?.message || axiosError.message

         throw new AppError(message, statusCode)
      }

      throw error
   }

   async get<T>(url: string, config?: HttpRequestConfig): Promise<T> {
      try {
         const response = await this.client.get<T>(url, this.mapConfig(config))
         return response.data
      } catch (error) {
         this.handleError(error)
      }
   }

   async post<T>(url: string, data?: unknown, config?: HttpRequestConfig): Promise<T> {
      try {
         const response = await this.client.post<T>(url, data, this.mapConfig(config))
         return response.data
      } catch (error) {
         this.handleError(error)
      }
   }

   async put<T>(url: string, data?: unknown, config?: HttpRequestConfig): Promise<T> {
      try {
         const response = await this.client.put<T>(url, data, this.mapConfig(config))
         return response.data
      } catch (error) {
         this.handleError(error)
      }
   }

   async delete<T>(url: string, config?: HttpRequestConfig): Promise<T> {
      try {
         const response = await this.client.delete<T>(url, this.mapConfig(config))
         return response.data
      } catch (error) {
         this.handleError(error)
      }
   }

   async patch<T>(url: string, data?: unknown, config?: HttpRequestConfig): Promise<T> {
      try {
         const response = await this.client.patch<T>(url, data, this.mapConfig(config))
         return response.data
      } catch (error) {
         this.handleError(error)
      }
   }
}
