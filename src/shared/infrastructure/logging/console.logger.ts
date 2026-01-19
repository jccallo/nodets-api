import { Logger } from '@/shared/domain/interfaces/logger.interface'

export class ConsoleLogger implements Logger {
   info(message: string, context?: Record<string, any>): void {
      console.log(`[INFO] ${message}`, context ? JSON.stringify(context) : '')
   }

   error(message: string, trace?: string, context?: Record<string, any>): void {
      console.error(`[ERROR] ${message}`, trace || '', context ? JSON.stringify(context) : '')
   }

   warn(message: string, context?: Record<string, any>): void {
      console.warn(`[WARN] ${message}`, context ? JSON.stringify(context) : '')
   }

   debug(message: string, context?: Record<string, any>): void {
      console.debug(`[DEBUG] ${message}`, context ? JSON.stringify(context) : '')
   }
}
