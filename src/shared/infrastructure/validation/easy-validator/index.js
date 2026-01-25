const StringValidator = require('./string-validator')
const ArrayValidator = require('./array-validator')
const NumberValidator = require('./number-validator')
const BooleanValidator = require('./boolean-validator')
const DateValidator = require('./date-validator')
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
      this._lastValidator = v
      return v.number(...args)
   }

   boolean(...args) {
      const v = new BooleanValidator()
      if (this._isOptional) v.optional()
      if (this._isNullable) v.nullable()
      if (this._requiredMsg) v.required(this._requiredMsg)
      this._lastValidator = v
      return v.boolean(...args)
   }

   date(...args) {
      const v = new DateValidator()
      if (this._isOptional) v.optional()
      if (this._isNullable) v.nullable()
      if (this._requiredMsg) v.required(this._requiredMsg)
      this._lastValidator = v
      return v.date(...args)
   }

   convert(...args) {
      if (this._lastValidator instanceof NumberValidator) {
         return this._lastValidator.convert(...args)
      }
      if (this._lastValidator instanceof BooleanValidator) {
         return this._lastValidator.convert()
      }
      return this
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
   boolean: () => new BooleanValidator().boolean(),
   date: () => new DateValidator().date(),
   optional: () => new FluentValidator().optional(),
   nullable: () => new FluentValidator().nullable(),
   required: (msg) => new FluentValidator().required(msg),
   validate,
}
