import { EventEmitter2 } from 'eventemitter2'

class EventBus {
   private emitter: EventEmitter2

   constructor() {
      this.emitter = new EventEmitter2({
         wildcard: true,
         delimiter: '.',
         newListener: false,
         maxListeners: 20,
      })
   }

   /**
    * Disparar un evento (Estilo Laravel/EventEmitter)
    */
   public emit(eventName: string, payload: any): void {
      this.emitter.emit(eventName, payload)
   }

   /**
    * Escuchar un evento (Estilo Laravel .listen)
    */
   public listen(eventName: string, handler: (payload: any) => void): void {
      this.emitter.on(eventName, handler)
   }
}

export const eventBus = new EventBus()
