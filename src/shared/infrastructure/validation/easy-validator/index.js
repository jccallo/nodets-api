const StringValidator = require('./string-validator')
const ArrayValidator = require('./array-validator')
const NumberValidator = require('./number-validator')
const BaseValidator = require('./base-validator')

/**
 * Validador Fluido para permitir llamadas como optional().string()
 */
class FluentValidator {
   constructor() {
      this._isOptional = false
      this._isNullable = false
   }

   optional() {
      this._isOptional = true
      return this
   }

   nullable() {
      this._isNullable = true
      return this
   }

   required(msg) {
      this._requiredMsg = msg
      return this
   }

   string(...args) {
      const v = new StringValidator()
      if (this._isOptional) v.optional()
      if (this._isNullable) v.nullable()
      if (this._requiredMsg) v.required(this._requiredMsg)
      return v.string(...args)
   }

   array(...args) {
      const v = new ArrayValidator()
      if (this._isOptional) v.optional()
      if (this._isNullable) v.nullable()
      if (this._requiredMsg) v.required(this._requiredMsg)
      return v.array(...args)
   }

   number(...args) {
      const v = new NumberValidator()
      if (this._isOptional) v.optional()
      if (this._isNullable) v.nullable()
      if (this._requiredMsg) v.required(this._requiredMsg)
      return v.number(...args)
   }

   convert(...args) {
      // Este método solo tiene sentido si el validador actual es de tipo número
      // Pero como FluentValidator es un constructor de cadenas, simplemente delegamos
      // al validador final si es NumberValidator.
      // En una arquitectura más compleja podríamos validar el tipo aquí,
      // pero por ahora seguimos la fluidez.
      return this.number().convert(...args)
   }
}

const validate = (data, schema) => {
   const errors = {}
   const validatedData = {}
   let hasErrors = false

   for (const key in schema) {
      const validator = schema[key]
      if (validator instanceof BaseValidator) {
         const { errors: fieldErrors, value } = validator.run(data[key])
         if (fieldErrors.length > 0) {
            errors[key] = fieldErrors
            hasErrors = true
         } else if (value !== undefined) {
            validatedData[key] = value
         }
      }
   }

   return {
      success: !hasErrors,
      errors: hasErrors ? errors : null,
      data: hasErrors ? null : validatedData,
   }
}

module.exports = {
   string: () => new StringValidator().string(),
   array: () => new ArrayValidator().array(),
   number: () => new NumberValidator().number(),
   optional: () => new FluentValidator().optional(),
   nullable: () => new FluentValidator().nullable(),
   required: (msg) => new FluentValidator().required(msg),
   validate,
}
