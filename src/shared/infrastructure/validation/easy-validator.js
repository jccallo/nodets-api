/**
 * EASY VALIDATOR
 * Una base de validación minimalista y extensible.
 */
class EasyValidator {
   constructor() {
      this.rules = []
      this.isOptional = false
      this.isNullable = false
      this.requiredMsg = 'Este campo es obligatorio'
   }

   optional() {
      this.isOptional = true
      return this
   }

   nullable() {
      this.isNullable = true
      return this
   }

   required(msg) {
      if (msg) this.requiredMsg = msg
      return this
   }

   _addRule(fn) {
      this.rules.push(fn)
      return this
   }

   string(msg = 'Debe ser una cadena de texto') {
      return this._addRule((v) => ({
         valid: typeof v === 'string',
         error: msg,
         value: v,
      }))
   }

   min(n, msg = `Debe tener al menos ${n} caracteres`) {
      return this._addRule((v) => ({
         valid: String(v).length >= n,
         error: msg,
         value: v,
      }))
   }

   max(n, msg = `Debe tener máximo ${n} caracteres`) {
      return this._addRule((v) => ({
         valid: String(v).length <= n,
         error: msg,
         value: v,
      }))
   }

   inList(list, msg = 'El valor no está en la lista permitida') {
      const lowerList = list.map((item) => String(item).toLowerCase())
      return this._addRule((v) => ({
         valid: lowerList.includes(String(v).toLowerCase()),
         error: msg,
         value: v,
      }))
   }

   includes(sub, msg = `Debe contener el valor: ${sub}`) {
      const lowerSub = String(sub).toLowerCase()
      return this._addRule((v) => ({
         valid: String(v).toLowerCase().includes(lowerSub),
         error: msg,
         value: v,
      }))
   }

   run(value) {
      if (value === null && this.isNullable) return { errors: [], value: null }

      if (value === undefined || value === null || value === '') {
         if (this.isOptional) return { errors: [], value: undefined }
         return { errors: [this.requiredMsg], value }
      }

      const errors = []
      let currentValue = value

      for (const rule of this.rules) {
         const result = rule(currentValue)
         if (!result.valid) {
            errors.push(result.error)
         }
         currentValue = result.value
      }

      return { errors, value: currentValue }
   }
}

/**
 * Función principal para validar un objeto contra un esquema
 */
const validate = (data, schema) => {
   const errors = {}
   const validatedData = {}
   let hasErrors = false

   for (const key in schema) {
      const validator = schema[key]
      if (validator instanceof EasyValidator) {
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

// Helpers para crear instancias fácilmente
const string = () => new EasyValidator().string()
const optional = () => new EasyValidator().optional()
const nullable = () => new EasyValidator().nullable()
const required = (msg) => new EasyValidator().required(msg)

module.exports = {
   EasyValidator,
   validate,
   string,
   optional,
   nullable,
   required,
}
