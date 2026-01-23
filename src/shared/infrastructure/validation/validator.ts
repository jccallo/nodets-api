export type ValidationRule = (value: any) => string | null

class ValidatorBuilder {
   private rules: ValidationRule[] = []
   private isOptional = false
   private requiredMsg: string | null = null

   /**
    * Marca el campo como opcional. Si el valor es null, undefined o "", se saltan las validaciones.
    */
   optional(): this {
      this.isOptional = true
      return this
   }

   /**
    * Define un mensaje personalizado para cuando el campo obligatorio falta.
    */
   required(message: string): this {
      this.requiredMsg = message
      return this
   }

   /**
    * Valida que el dato sea de tipo STRING.
    */
   string(message: string): this {
      this.rules.push((v) => (typeof v === 'string' ? null : message))
      return this
   }

   /**
    * Valida que el dato sea un NÚMERO (acepta números reales o strings numéricos).
    */
   number(message: string): this {
      this.rules.push((v) => (v !== '' && v !== null && !isNaN(Number(v)) ? null : message))
      return this
   }

   /**
    * Valida la LONGITUD MÍNIMA (para STRING o ARRAY).
    */
   min(length: number, message: string): this {
      this.rules.push((v) =>
         typeof v === 'string' || Array.isArray(v) ? (v.length >= length ? null : message) : message,
      )
      return this
   }

   /**
    * Valida la LONGITUD MÁXIMA (para STRING o ARRAY).
    */
   max(length: number, message: string): this {
      this.rules.push((v) =>
         typeof v === 'string' || Array.isArray(v) ? (v.length <= length ? null : message) : message,
      )
      return this
   }

   /**
    * Valida el formato de EMAIL.
    */
   email(message: string): this {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      this.rules.push((v) => (typeof v === 'string' && emailRegex.test(v) ? null : message))
      return this
   }

   /**
    * Valida que el dato sea un BOOLEANO (o string "true"/"false"/1/0).
    */
   boolean(message: string): this {
      this.rules.push((v) => {
         if (typeof v === 'boolean') return null
         if (v === 'true' || v === 'false' || v === 1 || v === 0 || v === '1' || v === '0') return null
         return message
      })
      return this
   }

   /**
    * Valida que el dato sea un OBJETO literal.
    */
   object(message: string): this {
      this.rules.push((v) => (typeof v === 'object' && v !== null && !Array.isArray(v) ? null : message))
      return this
   }

   /**
    * Valida que el dato sea un ARRAY.
    */
   array(message: string): this {
      this.rules.push((v) => (Array.isArray(v) ? null : message))
      return this
   }

   /**
    * Valida que el dato sea una FECHA válida.
    */
   date(message: string): this {
      this.rules.push((v) => (!isNaN(Date.parse(v)) ? null : message))
      return this
   }

   /**
    * Valida que el dato sea un NÚMERO ENTERO (acepta números o strings numéricos sin decimales).
    */
   integer(message: string): this {
      this.rules.push((v) => {
         const n = Number(v)
         return v !== '' && v !== null && Number.isInteger(n) ? null : message
      })
      return this
   }

   /**
    * Valida contra una EXPRESIÓN REGULAR.
    */
   regex(pattern: RegExp, message: string): this {
      this.rules.push((v) => (pattern.test(String(v)) ? null : message))
      return this
   }

   /**
    * Valida que el valor esté en una lista permitida (ENUM).
    */
   oneOf(values: any[], message: string): this {
      this.rules.push((v) => (values.includes(v) ? null : message))
      return this
   }

   /**
    * Valida formato UUID.
    */
   uuid(message: string): this {
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
      this.rules.push((v) => (uuidRegex.test(v) ? null : message))
      return this
   }

   /**
    * Valida formato URL.
    */
   url(message: string): this {
      this.rules.push((v) => {
         try {
            new URL(v)
            return null
         } catch (_) {
            return message
         }
      })
      return this
   }

   /**
    * Valida el VALOR MÍNIMO (para NÚMEROS o ENTEROS).
    */
   minValue(min: number, message: string): this {
      this.rules.push((v) => (Number(v) >= min ? null : message))
      return this
   }

   /**
    * Valida el VALOR MÁXIMO (para NÚMEROS o ENTEROS).
    */
   maxValue(max: number, message: string): this {
      this.rules.push((v) => (Number(v) <= max ? null : message))
      return this
   }

   run(value: any): string[] {
      const isEmpty = value === undefined || value === null || value === ''

      if (isEmpty) {
         if (this.isOptional) return []
         const fallbackMsg = this.rules[0] ? this.rules[0]('') : 'Required field'
         return [this.requiredMsg || fallbackMsg!]
      }

      const errors: string[] = []
      for (const rule of this.rules) {
         const error = rule(value)
         if (error) errors.push(error)
      }
      return errors
   }
}

/**
 * Crea una regla de tipo string con mensaje personalizado
 */
export const string = (message: string) => new ValidatorBuilder().string(message)

/**
 * Crea una regla de tipo number con mensaje personalizado
 */
export const number = (message: string) => new ValidatorBuilder().number(message)

/**
 * Crea una regla de tipo boolean con mensaje personalizado
 */
export const boolean = (message: string) => new ValidatorBuilder().boolean(message)

/**
 * Crea una regla de tipo object con mensaje personalizado
 */
export const object = (message: string) => new ValidatorBuilder().object(message)

/**
 * Crea una regla de tipo array con mensaje personalizado
 */
export const array = (message: string) => new ValidatorBuilder().array(message)

/**
 * Crea una regla de tipo date con mensaje personalizado
 */
export const date = (message: string) => new ValidatorBuilder().date(message)

/**
 * Crea una regla de tipo integer con mensaje personalizado
 */
export const integer = (message: string) => new ValidatorBuilder().integer(message)

/**
 * Crea una regla con expresión regular personalizada
 */
export const regex = (pattern: RegExp, message: string) => new ValidatorBuilder().regex(pattern, message)

/**
 * Crea una regla de tipo enum con mensaje personalizado
 */
export const oneOf = (values: any[], message: string) => new ValidatorBuilder().oneOf(values, message)

/**
 * Crea una regla de tipo uuid con mensaje personalizado
 */
export const uuid = (message: string) => new ValidatorBuilder().uuid(message)

/**
 * Crea una regla de tipo url con mensaje personalizado
 */
export const url = (message: string) => new ValidatorBuilder().url(message)

/**
 * Inicia una regla como opcional
 */
export const optional = () => new ValidatorBuilder().optional()

/**
 * Motor de validación
 */
export const validate = <T>(data: any, schema: Record<keyof T, ValidatorBuilder>) => {
   const errors: Record<string, string[]> = {}

   for (const field in schema) {
      const fieldErrors = schema[field].run(data[field])
      if (fieldErrors.length > 0) {
         errors[field] = fieldErrors
      }
   }

   const isValid = Object.keys(errors).length === 0

   return {
      success: isValid,
      errors: isValid ? null : errors,
      data: isValid ? (data as T) : null,
   }
}
