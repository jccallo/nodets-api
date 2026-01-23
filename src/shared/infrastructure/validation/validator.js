class ValidatorBuilder {
   constructor() {
      this.rules = []
      this.isOptional = false
      this.requiredMsg = null
   }

   /**
    * Marca el campo como opcional. Si el valor es null, undefined o "", se saltan las validaciones.
    */
   optional() {
      this.isOptional = true
      return this
   }

   /**
    * Define un mensaje personalizado para cuando el campo obligatorio falta.
    */
   required(message) {
      this.requiredMsg = message
      return this
   }

   /**
    * Valida que el dato sea de tipo STRING.
    */
   string(message) {
      this.rules.push((v) => (typeof v === 'string' ? null : message))
      return this
   }

   /**
    * Valida que el dato sea un NÚMERO (acepta números reales o strings numéricos).
    */
   number(message) {
      this.rules.push((v) => (v !== '' && v !== null && !isNaN(Number(v)) ? null : message))
      return this
   }

   /**
    * Valida la LONGITUD MÍNIMA (para STRING o ARRAY).
    */
   min(length, message) {
      this.rules.push((v) =>
         typeof v === 'string' || Array.isArray(v) ? (v.length >= length ? null : message) : message,
      )
      return this
   }

   /**
    * Valida la LONGITUD MÁXIMA (para STRING o ARRAY).
    */
   max(length, message) {
      this.rules.push((v) =>
         typeof v === 'string' || Array.isArray(v) ? (v.length <= length ? null : message) : message,
      )
      return this
   }

   /**
    * Valida el formato de EMAIL.
    */
   email(message) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      this.rules.push((v) => (typeof v === 'string' && emailRegex.test(v) ? null : message))
      return this
   }

   /**
    * Valida que el dato sea un BOOLEANO (o string "true"/"false"/1/0).
    */
   boolean(message) {
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
   object(message) {
      this.rules.push((v) => (typeof v === 'object' && v !== null && !Array.isArray(v) ? null : message))
      return this
   }

   /**
    * Valida que el dato sea un ARRAY.
    */
   array(message) {
      this.rules.push((v) => (Array.isArray(v) ? null : message))
      return this
   }

   /**
    * Valida que el dato sea una FECHA válida.
    */
   date(message) {
      this.rules.push((v) => (!isNaN(Date.parse(v)) ? null : message))
      return this
   }

   /**
    * Valida que el dato sea un NÚMERO ENTERO (acepta números o strings numéricos sin decimales).
    */
   integer(message) {
      this.rules.push((v) => {
         const n = Number(v)
         return v !== '' && v !== null && Number.isInteger(n) ? null : message
      })
      return this
   }

   /**
    * Valida contra una EXPRESIÓN REGULAR.
    */
   regex(pattern, message) {
      this.rules.push((v) => (pattern.test(String(v)) ? null : message))
      return this
   }

   /**
    * Valida que el valor esté en una lista permitida (ENUM).
    */
   oneOf(values, message) {
      this.rules.push((v) => (values.includes(v) ? null : message))
      return this
   }

   /**
    * Valida formato UUID.
    */
   uuid(message) {
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
      this.rules.push((v) => (uuidRegex.test(v) ? null : message))
      return this
   }

   /**
    * Valida formato URL.
    */
   url(message) {
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
   minValue(min, message) {
      this.rules.push((v) => (Number(v) >= min ? null : message))
      return this
   }

   /**
    * Valida el VALOR MÁXIMO (para NÚMEROS o ENTEROS).
    */
   maxValue(max, message) {
      this.rules.push((v) => (Number(v) <= max ? null : message))
      return this
   }

   run(value) {
      const isEmpty = value === undefined || value === null || value === ''

      if (isEmpty) {
         if (this.isOptional) return []
         // Si es obligatorio (default) y no hay valor, usamos el mensaje de required
         // o el mensaje de la primera regla como fallback
         const fallbackMsg = this.rules[0] ? this.rules[0]('') : 'Required field'
         return [this.requiredMsg || fallbackMsg]
      }

      const errors = []
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
export const string = (message) => new ValidatorBuilder().string(message)

/**
 * Crea una regla de tipo number con mensaje personalizado
 */
export const number = (message) => new ValidatorBuilder().number(message)

/**
 * Crea una regla de tipo boolean con mensaje personalizado
 */
export const boolean = (message) => new ValidatorBuilder().boolean(message)

/**
 * Crea una regla de tipo object con mensaje personalizado
 */
export const object = (message) => new ValidatorBuilder().object(message)

/**
 * Crea una regla de tipo array con mensaje personalizado
 */
export const array = (message) => new ValidatorBuilder().array(message)

/**
 * Crea una regla de tipo date con mensaje personalizado
 */
export const date = (message) => new ValidatorBuilder().date(message)

/**
 * Crea una regla de tipo integer con mensaje personalizado
 */
export const integer = (message) => new ValidatorBuilder().integer(message)

/**
 * Crea una regla con expresión regular personalizada
 */
export const regex = (pattern, message) => new ValidatorBuilder().regex(pattern, message)

/**
 * Crea una regla de tipo enum con mensaje personalizado
 */
export const oneOf = (values, message) => new ValidatorBuilder().oneOf(values, message)

/**
 * Crea una regla de tipo uuid con mensaje personalizado
 */
export const uuid = (message) => new ValidatorBuilder().uuid(message)

/**
 * Crea una regla de tipo url con mensaje personalizado
 */
export const url = (message) => new ValidatorBuilder().url(message)

/**
 * Inicia una regla como opcional
 */
export const optional = () => new ValidatorBuilder().optional()

/**
 * Motor de validación
 */
export const validate = (data, schema) => {
   const errors = {}

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
      data: isValid ? data : null,
   }
}
